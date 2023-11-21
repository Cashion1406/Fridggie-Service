import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { WorkflowEntity } from './entities/workflow.entity'
import { FindOptionsWhere, ILike, Like, Repository } from 'typeorm'
import { IQueryableWorkflowRepository } from './workflow.interface'
import { WorkflowDto } from '../controller/dtos/workflow.dtos'
import { WorkflowMapper } from './mappers/workflow.mapper'
import { Workflow } from '../domain'
import { FilterWorkflowDTO } from '../controller/dtos/filter-workflow.dtos'

@Injectable()
export class WorkflowRepository implements IQueryableWorkflowRepository {
	constructor(
		@InjectRepository(WorkflowEntity)
		private readonly workflowRepo: Repository<WorkflowEntity>,
		private readonly mapper: WorkflowMapper,
	) {}

	queryById(id: number): Promise<WorkflowEntity> {
		return this.workflowRepo.findOne({
			where: {
				id,
			},
			relations: ['icon'],
		})
	}

	async getAllWorkflow(): Promise<WorkflowDto[]> {
		const workflows = await this.workflowRepo.find({ relations: ['icon'] })
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

		return entity ? this.mapper.toDomain(entity) : null
	}

	async getFlowByName(name: string) {
		const entity = await this.workflowRepo.findOne({ where: { name } })
		return entity ? this.mapper.toDomain(entity) : null
	}

	async save(workflow: Workflow): Promise<Workflow> {
		const entity = this.mapper.toOrm(workflow)
		const result = await this.workflowRepo.save(entity)

		return this.mapper.toDomain(result)
	}

	async delete(id: number): Promise<boolean> {
		const result = await this.workflowRepo.delete(id)
		return result.affected > 0 ? true : false
	}
}
