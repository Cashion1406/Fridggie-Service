import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { WorkflowEntity } from './entities/workflow.entity'
import {
	Equal,
	FindOneOptions,
	FindOptionsWhere,
	ILike,
	Like,
	Not,
	Repository,
} from 'typeorm'
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
import { DocumentEntity } from 'src/modules/step/database/entities/document.entity'
import { Document } from 'src/modules/step/domain/document'
import { DocumentMapper } from 'src/modules/step/database/mapper/document.mapper'
import { UserAlreadyAssignedException } from 'src/modules/user/exception/user.exceptions'

@Injectable()
export class WorkflowRepository implements IQueryableWorkflowRepository {
	constructor(
		@InjectRepository(WorkflowEntity)
		private readonly workflowRepo: Repository<WorkflowEntity>,

		@InjectRepository(StepEntity)
		private readonly stepRepo: Repository<StepEntity>,

		@InjectRepository(UserEntity)
		private readonly userRepo: Repository<UserEntity>,

		@InjectRepository(DocumentEntity)
		private readonly documentRepo: Repository<DocumentEntity>,

		private readonly workflowMapper: WorkflowMapper,
		private readonly stepMapper: StepMapper,
		private readonly userMapper: UserMapper,

		private readonly documentMapper: DocumentMapper,
	) {}

	queryById(id: number): Promise<WorkflowEntity> {
		return this.workflowRepo.findOne({
			where: {
				id,
			},
			relations: ['icon', 'steps', 'steps.owner', 'steps.documents'],
		})
	}

	async getAllWorkflow(): Promise<WorkflowDto[]> {
		const workflows = await this.workflowRepo.find({
			relations: ['icon', 'steps', 'steps.owner', 'steps.documents'],
		})

		return workflows.map((data) => new WorkflowDto(data))
	}

	async searchWorkflow(filterDTO: FilterWorkflowDTO): Promise<WorkflowDto[]> {
		const { name, description, keywords } = filterDTO

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
			relations: ['icon', 'steps', 'steps.owner', 'steps.documents'],
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
		const { name, description, keywords } = filterDTO

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

		//Search across relevant field in workflow with string search
		keywords &&
			query.andWhere(
				'workflow.name ILike :search or workflow.description ILike :search',
				{ search: `%${keywords}%` },
			)

		const workflow = await query.getMany()

		return workflow.map((data) => new WorkflowDto(data))
	}

	async getFlowById(id: number): Promise<Workflow> {
		const entity = await this.workflowRepo.findOne({
			where: {
				id,
			},
		})

		return entity ? this.workflowMapper.toDomain(entity) : null
	}

	async getStepById(id: number, withRelations?: boolean): Promise<Step> {
		const conditions: FindOneOptions<StepEntity> = {
			where: { id },
		}
		if (withRelations) {
			conditions.relations = ['owner', 'documents']
		}
		const entity = await this.stepRepo.findOne(conditions)
		return entity ? this.stepMapper.toDomain(entity) : null
	}

	async getFlowByName(name: string, existing_workflow_id?: number) {
		const entity = await this.workflowRepo.findOne({
			where: {
				name: ILike(name),

				/* exclude the updating workflow with id if provided
				 * because we don't search for dulplicate name with the current update entity
				 */
				...(existing_workflow_id && {
					id: Not(Equal(existing_workflow_id)),
				}),
			},
		})
		return entity ? this.workflowMapper.toDomain(entity) : null
	}

	async getUserById(id: number): Promise<UserEntity> {
		return await this.userRepo.findOneBy({ id })
	}

	async save(workflow: Workflow): Promise<Workflow> {
		const entity = this.workflowMapper.toOrm(workflow)
		const result = await this.workflowRepo.save(entity)

		return this.workflowMapper.toDomain(result)
	}

	async saveSteps(steps: Step[]) {
		const stepsEntity = steps.map((stepDTO) =>
			this.stepMapper.toOrm(stepDTO),
		)
		const result = await this.stepRepo.save(stepsEntity)

		return result.map((stepData) => this.stepMapper.toDomain(stepData))
	}

	async checkStepDuplicateByNameFromWorkflow(
		name: string,
		workflow_id: number,
		existing_step_id?: number,
	): Promise<boolean> {
		const steps = await this.stepRepo.find({
			where: {
				workflow: {
					id: workflow_id,
				},
				name: ILike(name),

				// exclude updating step from the query if id provided
				...(existing_step_id && {
					id: Not(Equal(existing_step_id)),
				}),
			},
		})
		return steps.length > 0 ? true : false
	}

	async checkAssignedUser(
		owner_id: number,
		workflow_id: number,
		existing_step_id?: number,
	): Promise<string> {
		const steps = await this.stepRepo.find({
			where: {
				workflow: {
					id: workflow_id,
				},
			},
			relations: ['owner'],
		})

		/*find  first step where the owner_id = the passed owner_id
		 * and exclude the current updating step from the query
		 */
		const assignedStep = steps.find(
			(step) =>
				step.id !== existing_step_id && step.owner.id === owner_id,
		)

		if (assignedStep) {
			return assignedStep.name
		} else {
			return null
		}
	}

	async saveStep(
		steps: Step,
		owner_id?: number,
		workflow_id?: number,
		existing_step_id?: number,
	) {
		const isAssigned = await this.checkAssignedUser(
			owner_id,
			workflow_id,
			existing_step_id,
		)
		if (isAssigned) throw new UserAlreadyAssignedException()

		const stepEntity = this.stepMapper.toOrm(steps)

		const result = await this.stepRepo.save(stepEntity)
		return this.stepMapper.toDomain(result)
	}

	async saveDocuments(documents: Document[]): Promise<Document[]> {
		const documentEntiy = documents.map((documentDTO) =>
			this.documentMapper.toOrm(documentDTO),
		)
		const result = await this.documentRepo.save(documentEntiy)

		return result.map((documentData) =>
			this.documentMapper.toDomain(documentData),
		)
	}

	async saveDocument(document: Document): Promise<Document> {
		const entity = this.documentMapper.toOrm(document)
		const result = await this.documentRepo.save(entity)

		return this.documentMapper.toDomain(result)
	}

	async delete(id: number): Promise<boolean> {
		const result = await this.workflowRepo.delete(id)
		return result.affected > 0 ? true : false
	}

	async deleteStep(step_id: number): Promise<boolean> {
		const result = await this.stepRepo.delete(step_id)
		return result.affected > 0
	}
}
