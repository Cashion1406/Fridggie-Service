import {
	Body,
	ClassSerializerInterceptor,
	Controller,
	Delete,
	Get,
	HttpCode,
	Logger,
	Param,
	ParseArrayPipe,
	Patch,
	Post,
	Query,
	UseInterceptors,
} from '@nestjs/common'
import {
	ApiBody,
	ApiOperation,
	ApiParam,
	ApiResponse,
	ApiTags,
} from '@nestjs/swagger'
import { WorkflowDto } from './dtos/workflow.dtos'

import {
	WorkflowExistsException,
	WorkflowNotFoundException,
} from '../exceptions/workflow.exceptions'
import {
	UpdateWorkflowRequestDTO,
	UpdateWorkflowResponseDTO,
} from './dtos/update-workflow.dts'
import { DeleteWorkflowResponseDTO } from './dtos/delete-workflow.dtos'
import { SuccessResponseDTO } from '@libs'
import { ResultCode } from 'src/libs/enums/result-code.enum'
import { WorkflowRepository } from '../database'
import { Workflow } from '../domain'
import { IconRepository } from 'src/modules/icon/database'
import { FilterWorkflowDTO } from './dtos/filter-workflow.dtos'
import {
	CreateWorkflowResponseDTO,
	CreateWorkflowStepDocumentRequestDTO,
} from './dtos/create-workflow-step-document.dtos'
import { Step } from 'src/modules/step/domain/step'
import {
	StepExistsException,
	StepNotFoundException,
} from 'src/modules/step/exception/step.exceptions'
import { Document } from 'src/modules/step/domain/document'
import {
	UserAlreadyAssignedException,
	UserNotFoundException,
} from 'src/modules/user/exception/user.exceptions'
import {
	UpdateStepRequestDTO,
	UpdateStepResponseDTO,
} from 'src/modules/step/controller/dtos/update-step.dtos'
import { UserRepository } from 'src/modules/user/database/user.repository'
import {
	CreateStepRequestDTO,
	CreateStepResponseDTO,
} from 'src/modules/step/controller/dtos/create-step.dtos'

import { BadRequestException } from '@libs'
import { CustomParseIntPipe } from '../../../libs/pipes/custom-parseintpipe'
import { StepDTO } from 'src/modules/step/controller/dtos/step.dtos'
import { DeleteStepResponseDTO } from 'src/modules/step/controller/dtos/delete-step.dtos'
@Controller('/workflows')
@ApiTags('Workflow')
@UseInterceptors(ClassSerializerInterceptor)
export class WorkflowController {
	constructor(
		private readonly workflowRepo: WorkflowRepository,
		private readonly iconRepo: IconRepository,
		private readonly userRepo: UserRepository,
	) {}

	//Get list of flows
	@Get()
	@ApiOperation({
		summary: 'Get all worfklow with associated steps, user and documents',
	})
	@HttpCode(200)
	@ApiResponse({
		status: 200,
		type: [WorkflowDto],
	})
	async getAllFlow(): Promise<WorkflowDto[]> {
		return this.workflowRepo.getAllWorkflow()
	}

	//Search flow by name, description, etc
	/*Important:
	 * I put search method on top of get workflow by id
	 * Because nestjs also use routing system follow first-match-wins strategy*/
	@Get('/search')
	@ApiResponse({
		status: 200,
		type: [WorkflowDto],
	})
	async searchWorkflows(
		@Query() filterDTO: FilterWorkflowDTO,
	): Promise<WorkflowDto[]> {
		return await this.workflowRepo.searchWorkflow(filterDTO)
	}

	//Get a workflow details
	@Get(':workflow_id')
	@ApiOperation({ summary: 'Get a workflow details' })
	@ApiParam({
		description: 'Enter workflow ID',
		name: 'workflow_id',
	})
	@ApiResponse({
		status: 200,
		type: WorkflowDto,
	})
	async getFlowById(
		@Param('workflow_id', CustomParseIntPipe) workflow_id: number,
	): Promise<WorkflowDto> {
		const workflow = await this.workflowRepo.queryById(workflow_id)

		if (!workflow) {
			throw new WorkflowNotFoundException()
		}

		return new WorkflowDto(workflow)
	}

	//Get a step details from a workflow
	@Get(':workflow_id/steps/:step_id')
	@ApiOperation({ summary: 'Get a step details' })
	@ApiParam({
		description: 'Enter workflow ID',
		name: 'workflow_id',
	})
	@ApiParam({
		description: 'Enter step ID',
		name: 'step_id',
	})
	@ApiResponse({
		status: 200,
		type: StepDTO,
	})
	async getStepById(
		@Param('workflow_id', CustomParseIntPipe) workflow_id: number,
		@Param('step_id', CustomParseIntPipe) step_id: number,
	): Promise<StepDTO> {
		const existingWorkflow =
			await this.workflowRepo.getFlowById(workflow_id)

		if (!existingWorkflow) {
			throw new WorkflowNotFoundException()
		}
		const step = await this.workflowRepo.getStepById(step_id, true)

		if (!step) {
			throw new StepNotFoundException()
		}

		return step.serialize()
	}

	//Create workflow with related steps and documents
	@Post()
	@HttpCode(201)
	@ApiOperation({
		summary: 'Create a workflow with related steps and documents',
	})
	@ApiResponse({
		status: 201,
		type: CreateWorkflowResponseDTO,
	})
	async createWorkflowWithSteps(
		@Body() dto: CreateWorkflowStepDocumentRequestDTO,
	): Promise<CreateWorkflowResponseDTO> {
		const { name, description, icon_id, steps } = dto

		let existingWorkflow = await this.workflowRepo.getFlowByName(name)

		if (existingWorkflow) {
			throw new WorkflowExistsException()
		}

		const icon = icon_id ? await this.iconRepo.getIcon(icon_id) : null

		/*
		Check duplicate steps name, assigned user and invalid user in the dto
		Should refactor into separate smaller chunk for readability
		*/
		const stepNames = new Set<string>()
		const userAssigned = new Set<number>()
		if (steps) {
			for (const stepData of steps) {
				if (stepNames.has(stepData.name.trim().toLowerCase())) {
					throw new StepExistsException()
				}
				stepNames.add(stepData.name.trim().toLowerCase())

				if (userAssigned.has(stepData.owner_id)) {
					Logger.error(
						`This user was assigned in step ${stepData.name}`,
					)
					throw new UserAlreadyAssignedException()
				}
				userAssigned.add(stepData.owner_id)
				const owner = await this.workflowRepo.getUserById(
					stepData.owner_id,
				)
				if (!owner) {
					Logger.error(`NO such user for step ${stepData.name}`)
					throw new UserNotFoundException()
				}
			}
		}

		//Create a instance of Workflow domain
		existingWorkflow = Workflow.createNewFlow(
			name,
			description,
			icon,
			steps
				? await this.workflowRepo.saveSteps(
						await Promise.all(
							steps.map(async (stepData) => {
								const documents =
									stepData.documents &&
									(await Promise.all(
										stepData.documents.map(
											async (documentData?) =>
												Document.createNewDocuments(
													documentData.name,
													documentData.type,
												),
										),
									))

								return Step.createNewStep(
									stepData.name,
									stepData.description,
									await this.workflowRepo.getUserById(
										stepData.owner_id,
									),
									existingWorkflow,
									stepData.documents
										? await this.workflowRepo.saveDocuments(
												documents,
										  )
										: [],
								)
							}),
						),
				  )
				: [],
		)

		//save workflow after check steps validations and workflow validations
		existingWorkflow = await this.workflowRepo.save(existingWorkflow)

		return {
			workflow: existingWorkflow.serialize(),
		}
	}

	//Add additional steps and documents after workflow creation
	@Post(':workflow_id/steps')
	@ApiOperation({
		summary: 'Add additional steps and documents based on workflow ID',
	})
	@ApiBody({
		type: [CreateStepRequestDTO],
		description: 'Provide a list of create step and document DTO',
	})
	@ApiParam({
		description: 'Enter workflow ID',
		name: 'workflow_id',
	})
	@ApiResponse({
		status: 201,
		type: [CreateStepResponseDTO],
	})
	async createSteps(
		@Param('workflow_id', CustomParseIntPipe) workflow_id: number,
		@Body(
			new ParseArrayPipe({
				items: CreateStepRequestDTO,

				exceptionFactory: (error) => new BadRequestException(error),
			}),
		)
		dto: CreateStepRequestDTO[],
	): Promise<CreateStepResponseDTO[]> {
		const workflow = await this.workflowRepo.getFlowById(workflow_id)
		if (!workflow) throw new WorkflowNotFoundException()
		const stepNames = new Set<string>()
		const userAssigned = new Set<number>()
		if (dto) {
			for (const stepData of dto) {
				//check duplicate step name in the dto and in db
				if (
					stepNames.has(stepData.name?.trim().toLowerCase()) ||
					(await this.workflowRepo.checkStepDuplicateByNameFromWorkflow(
						stepData.name,
						workflow_id,
					))
				) {
					Logger.log(`Step name in DTO: ${stepData.name}`)

					throw new StepExistsException()
				}
				stepNames.add(stepData.name?.trim().toLowerCase())

				//check duplicate owner in the dto and in the db
				if (
					userAssigned.has(stepData.owner_id) ||
					(await this.workflowRepo.checkAssignedUser(
						stepData.owner_id,
						workflow_id,
					))
				) {
					Logger.error(
						`User with ID ${
							stepData.owner_id
						} was assigned in ${await this.workflowRepo.checkAssignedUser(
							stepData.owner_id,
							workflow_id,
						)}`,
					)
					throw new UserAlreadyAssignedException()
				}
				userAssigned.add(stepData.owner_id)
				const owner = await this.workflowRepo.getUserById(
					stepData.owner_id,
				)

				//check invalid user owner in the dto
				if (!owner) {
					Logger.error(`NO such user for step ${stepData.name}`)
					throw new UserNotFoundException()
				}
			}
		}

		let steps =
			dto &&
			(await Promise.all(
				dto.map(async (stepData) => {
					const documents =
						stepData.documents &&
						(await Promise.all(
							stepData.documents.map(async (documentData?) =>
								Document.createNewDocuments(
									documentData.name,
									documentData.type,
								),
							),
						))

					return Step.createNewStep(
						stepData.name,
						stepData.description,
						await this.workflowRepo.getUserById(stepData.owner_id),
						workflow,
						stepData.documents
							? await this.workflowRepo.saveDocuments(documents)
							: [],
					)
				}),
			))
		steps = await this.workflowRepo.saveSteps(steps)

		return steps.map((stepData) => stepData.serialize())
	}

	//Update a specific workflow
	@Patch(':workflow_id')
	@ApiOperation({ summary: 'Update workflow details' })
	@ApiResponse({
		status: 200,
		type: UpdateWorkflowResponseDTO,
	})
	async updateWorkflow(
		@Param('workflow_id', CustomParseIntPipe) workflow_id: number,
		@Body() dto: UpdateWorkflowRequestDTO,
	): Promise<UpdateWorkflowResponseDTO> {
		const { icon_id } = dto
		const existingWorkflow =
			await this.workflowRepo.getFlowById(workflow_id)

		if (!existingWorkflow) {
			throw new WorkflowNotFoundException()
		}
		const duplicateName = await this.workflowRepo.getFlowByName(
			dto.name,
			workflow_id,
		)
		if (duplicateName) {
			throw new WorkflowExistsException()
		}

		const icon = icon_id ? await this.iconRepo.getIcon(icon_id) : undefined

		existingWorkflow.update(dto, icon)

		await this.workflowRepo.save(existingWorkflow)

		return { workflow: existingWorkflow.serialize() }
	}

	//Update a specific step in a desired workflow
	@Patch(':workflow_id/steps/:step_id')
	@ApiOperation({ summary: 'Update step details' })
	@ApiParam({
		description: 'Enter workflow ID',
		name: 'workflow_id',
	})
	@ApiParam({
		description: 'Enter step ID',
		name: 'step_id',
	})
	@ApiResponse({
		status: 200,
		type: UpdateStepResponseDTO,
	})
	async updateStep(
		@Param('workflow_id', CustomParseIntPipe) workflow_id: number,
		@Param('step_id', CustomParseIntPipe) step_id: number,
		@Body() dto: UpdateStepRequestDTO,
	): Promise<UpdateStepResponseDTO> {
		const existingWorkflow =
			await this.workflowRepo.getFlowById(workflow_id)

		if (!existingWorkflow) {
			throw new WorkflowNotFoundException()
		}

		let existStep = await this.workflowRepo.getStepById(step_id)
		if (!existStep) throw new StepNotFoundException()

		//check duplicate step name in the dto and in db
		if (
			await this.workflowRepo.checkStepDuplicateByNameFromWorkflow(
				dto.name,
				workflow_id,
				step_id,
			)
		) {
			throw new StepExistsException()
		}

		//check invalid user owner in the dto
		const owner = await this.workflowRepo.getUserById(dto.owner_id)
		if (!owner) {
			Logger.error(`NO such user for step ${dto.name}`)
			throw new UserNotFoundException()
		}

		const new_owner = dto.owner_id
			? await this.userRepo.getUserById(dto.owner_id)
			: undefined

		existStep.update(dto, new_owner)

		existStep = await this.workflowRepo.saveStep(
			existStep,
			new_owner?.id,
			workflow_id,
			step_id,
		)
		return {
			step: existStep.serialize(),
		}
	}

	//Delete a specific worklow
	@Delete(':workflow_id')
	@ApiOperation({ summary: 'Detele a workflow' })
	@ApiParam({
		description: 'Enter workflow ID',
		name: 'workflow_id',
	})
	@ApiResponse({
		status: 204,
		type: DeleteWorkflowResponseDTO,
	})
	async deleteWorkflow(
		@Param('workflow_id', CustomParseIntPipe) workflow_id: number,
	): Promise<SuccessResponseDTO> {
		const deleteSuccess = await this.workflowRepo.delete(workflow_id)

		if (!deleteSuccess) {
			throw new WorkflowNotFoundException()
		}

		return {
			resultCode: ResultCode.Success,
		}
	}

	//Delete a specific step in workflow
	@Delete(':workflow_id/steps/:step_id')
	@ApiOperation({ summary: 'Detele a step' })
	@ApiParam({
		description: 'Enter workflow ID',
		name: 'workflow_id',
	})
	@ApiParam({
		description: 'Enter step ID',
		name: 'step_id',
	})
	@ApiResponse({
		status: 204,
		type: DeleteStepResponseDTO,
	})
	async deleteStep(
		@Param('workflow_id', CustomParseIntPipe) workflow_id: number,
		@Param('step_id', CustomParseIntPipe) step_id: number,
	): Promise<SuccessResponseDTO> {
		const existingWorkflow =
			await this.workflowRepo.getFlowById(workflow_id)

		if (!existingWorkflow) {
			throw new WorkflowNotFoundException()
		}
		const existStep = await this.workflowRepo.getStepById(step_id)
		if (!existStep) throw new StepNotFoundException()

		await this.workflowRepo.deleteStep(step_id)

		return {
			resultCode: ResultCode.Success,
		}
	}
}
