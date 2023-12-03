import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { WorkflowEntity } from './entities/workflow.entity'
import { FindOptionsWhere, ILike, Like, Repository } from 'typeorm'
import { IQueryableWorkflowRepository } from './workflow.interface'
import { WorkflowDto } from '../controller/dtos/workflow.dtos'
import { WorkflowMapper } from './mappers/workflow.mapper'
import { Workflow } from '../domain'
import { FilterWorkflowDTO } from '../controller/dtos/filter-workflow.dtos'
import { Step } from 'src/modules/step/domain/step'
import { StepMapper } from 'src/modules/step/database/mapper/step.mapper'
import { StepEntity } from 'src/modules/step/database/entities/step.entity'
import { UserEntity } from 'src/modules/user/database/entities/user.entity'
import { UserMapper } from 'src/modules/user/database/mappers/user.mapper'

@Injectable()
export class WorkflowRepository implements IQueryableWorkflowRepository {
	constructor(
		@InjectRepository(WorkflowEntity)
		private readonly workflowRepo: Repository<WorkflowEntity>,

		@InjectRepository(StepEntity)
		private readonly stepRepo: Repository<StepEntity>,

		@InjectRepository(UserEntity)
		private readonly userRepo: Repository<UserEntity>,

		private readonly workflowMapper: WorkflowMapper,
		private readonly stepMapper: StepMapper,
		private readonly userMapper: UserMapper,
	) {}

	queryById(id: number): Promise<WorkflowEntity> {
		return this.workflowRepo.findOne({
			where: {
				id,
			},
			relations: ['icon', 'steps', 'steps.owner'],
		})
	}

	async getAllWorkflow(): Promise<WorkflowDto[]> {
		const workflows = await this.workflowRepo.find({
			relations: ['icon', 'steps', 'steps.owner'],
		})
		// relations:['icon'],
		// select:{
		// 	icon:{
		// 		path:true}
		// 	}
		// }
		return workflows.map((data) => new WorkflowDto(data))
	}

	async searchWorkflow(filterDTO: FilterWorkflowDTO): Promise<WorkflowDto[]> {
		const { name, description, icon_id, keywords } = filterDTO

		let conditions:
			| FindOptionsWhere<WorkflowEntity>
			| FindOptionsWhere<WorkflowEntity>[] = {}

		if (name) {
			conditions.name = ILike(`%${filterDTO.name}%`)
		}

		if (description) {
			conditions.description = ILike(`%${filterDTO.description}%`)
		}
		if (keywords) {
			conditions = [
				{ name: ILike(`%${keywords}%`) },
				{ description: ILike(`%${keywords}%`) },
			]
		}
		const workflows = await this.workflowRepo.find({
			relations: ['icon'],
			where: conditions,
			// {
			// 	//Filter by workflow name
			// 	...(name && { name: ILike(`%${name}%`) }),

			// 	// //Filter by workflow desc
			// 	...(description && { description: ILike(`%${description}%`) }),

			// 	//Filter by icon_id of workflow
			// 	...(icon_id && { icon: { id: icon_id } }),

			// 	//Search across all fields with string search
			// 	...(keywords && {
			// 		name: ILike(`%${keywords}%`)['OR'],
			// 		description: ILike(`%${keywords}%`),
			// 	}),
			// },
		})
		// relations:['icon'],
		// select:{
		// 	icon:{
		// 		path:true}
		// 	}
		// }
		return workflows.map((data) => new WorkflowDto(data))
	}

	async searchWorkflowByQueryBuilder(
		filterDTO: FilterWorkflowDTO,
	): Promise<WorkflowDto[]> {
		const { name, description, icon_id, keywords } = filterDTO

		const query = this.workflowRepo.createQueryBuilder('workflow')
		//Add leftjoin if want to retrieve icon info
		//.leftJoinAndSelect('workflow.icon', 'icon')

		//Filter by workflow name
		name &&
			query.andWhere('workflow.name ILike :name', {
				name: `%${name}%`,
			})

		//Filter by workflow desc
		description &&
			query.andWhere('workflow.description ILike :description', {
				description: `%${description}%`,
			})

		//Filter by icon_id of workflow
		icon_id && query.andWhere('icon.id = :icon_id', { icon_id })

		//Search across relevant field in workflow with string search
		keywords &&
			query.andWhere(
				'workflow.name ILike :search or workflow.description ILike :search',
				{ search: `%${keywords}%` },
			)

		const workflow = await query.getMany()

		return workflow.map((data) => new WorkflowDto(data))
	}

	async getFlowById(id: number) {
		const entity = await this.workflowRepo.findOne({
			where: {
				id,
			},
		})

		return entity ? this.workflowMapper.toDomain(entity) : null
	}

	async getFlowByName(name: string) {
		const entity = await this.workflowRepo.findOne({
			where: { name: ILike(name) },
		})
		return entity ? this.workflowMapper.toDomain(entity) : null
	}

	async getStepByName(name: string) {
		return await this.stepRepo.findOne({ where: { name: ILike(name) } })
	}

	async getUserById(id: number): Promise<UserEntity> {
		return await this.userRepo.findOneBy({ id })
	}

	async save(workflow: Workflow): Promise<Workflow> {
		const entity = this.workflowMapper.toOrm(workflow)
		const result = await this.workflowRepo.save(entity)

		return this.workflowMapper.toDomain(result)
	}

	async saveSteps(steps: Step[]): Promise<Step[]> {
		const stepsEntity = steps.map((stepDTO) =>
			this.stepMapper.toOrm(stepDTO),
		)
		const result = await this.stepRepo.save(stepsEntity)

		return result.map((stepData) => this.stepMapper.toDomain(stepData))
	}

	async delete(id: number): Promise<boolean> {
		const result = await this.workflowRepo.delete(id)
		return result.affected > 0 ? true : false
	}
}
