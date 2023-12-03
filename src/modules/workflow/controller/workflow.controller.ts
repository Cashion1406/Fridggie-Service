import {
	Body,
	ClassSerializerInterceptor,
	Controller,
	Delete,
	Get,
	HttpCode,
	Logger,
	Param,
	Patch,
	Post,
	Query,
	UseInterceptors,
} from '@nestjs/common'
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger'
import { WorkflowDto } from './dtos/workflow.dtos'
import {
	CreateWorkflowRequestDTO,
	CreateWorkflowResponseDTO,
} from './dtos/create-workflow.dtos'

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
	CreateWorkflowStepRequestDTO,
	CreateWorkflowStepResponseDTO,
} from './dtos/create-workflow-step.dtos'
import { Step } from 'src/modules/step/domain/step'
import { StepExistsException } from 'src/modules/step/exception/step.exceptions'

@Controller('/workflows')
@ApiTags('Workflow')
@UseInterceptors(ClassSerializerInterceptor)
export class WorkflowController {
	constructor(
		private readonly workflowRepo: WorkflowRepository,
		private readonly iconRepo: IconRepository,
	) {}

	//Get list of flows
	@Get()
	@ApiOperation({
		summary: 'Get all worfklow with associated steps, user and documents',
	})
	@HttpCode(200)
	@ApiResponse({
		status: 200,
		type: WorkflowDto,
	})
	async getAllFlow(): Promise<WorkflowDto[]> {
		return this.workflowRepo.getAllWorkflow()
	}

	//Get a workflow details
	@Get(':id')
	@ApiOperation({ summary: 'Get a workflow details' })
	@ApiParam({
		description: 'Enter workflow ID',
		name: 'id',
	})
	@ApiResponse({
		status: 200,
		type: WorkflowDto,
	})
	async getFlowById(@Param('id') id: number): Promise<WorkflowDto> {
		const workflow = await this.workflowRepo.queryById(id)

		if (!workflow) {
			throw new WorkflowNotFoundException()
		}

		return new WorkflowDto(workflow)
	}

	//Search flow by name, description, etc
	@Get('/search')
	@ApiResponse({
		status: 200,
		type: WorkflowDto,
	})
	async searchWorkflows(
		@Query() filterDTO: FilterWorkflowDTO,
	): Promise<WorkflowDto[]> {
		return await this.workflowRepo.searchWorkflow(filterDTO)
	}

	@Post()
	@HttpCode(201)
	@ApiResponse({
		status: 201,
		type: CreateWorkflowResponseDTO,
	})
	async createWorkflow(
		@Body() workflowdto: CreateWorkflowRequestDTO,
	): Promise<CreateWorkflowResponseDTO> {
		const existingWorkflow = await this.workflowRepo.getFlowByName(
			workflowdto.name,
		)

		if (existingWorkflow) {
			throw new WorkflowExistsException()
		}

		const icon = workflowdto.icon_id
			? await this.iconRepo.getIcon(workflowdto.icon_id)
			: null

		let workflow = Workflow.createNewFlow(workflowdto, icon)

		workflow = await this.workflowRepo.save(workflow)
		return {
			workflow: workflow.serialize(),
		}
	}

	@Post('/steps')
	@HttpCode(201)
	@ApiOperation({ summary: 'Create a workflow with related steps' })
	@ApiResponse({
		status: 201,
		type: CreateWorkflowStepResponseDTO,
	})
	async createWorkflowWithSteps(
		@Body() dto: CreateWorkflowStepRequestDTO,
	): Promise<CreateWorkflowResponseDTO> {
		const existingWorkflow = await this.workflowRepo.getFlowByName(dto.name)

		if (existingWorkflow) {
			throw new WorkflowExistsException()
		}

		const icon = dto.icon_id
			? await this.iconRepo.getIcon(dto.icon_id)
			: null

		//Check duplicate steps name
		const stepNames = new Set<string>()
		for (const stepData of dto.steps) {
			if (stepNames.has(stepData.name.trim().toLocaleLowerCase())) {
				throw new StepExistsException()
			}
			stepNames.add(stepData.name.trim().toLocaleLowerCase())
		}

		//Create a instance of Workflow domain
		let workflow = Workflow.createNewFlow(dto, icon)

		//save workflow after check steps validations and workflow validations
		workflow = await this.workflowRepo.save(workflow)

		//Loop through steps in the request dto to create a instance of Step domain
		const steps = await Promise.all(
			dto.steps.map(async (stepData) =>
				Step.createNewStep(
					stepData.name,
					stepData.description,
					await this.workflowRepo.getUserById(stepData.owner_id),
					workflow,
				),
			),
		)
		//save a list of Step domain into db as Step entity
		await this.workflowRepo.saveSteps(steps)
		Logger.log('Workflow: ', workflow)

		Logger.log('Steps: ', steps)
		return {
			workflow: workflow.serialize(),
		}
	}

	@Patch(':id')
	@ApiOperation({ summary: 'Update workflow details' })
	@ApiResponse({
		status: 200,
		type: UpdateWorkflowResponseDTO,
	})
	async updateWorkflow(
		@Param('id') id: number,
		@Body() dto: UpdateWorkflowRequestDTO,
	): Promise<UpdateWorkflowResponseDTO> {
		const existingWorkflow = await this.workflowRepo.getFlowById(id)

		if (!existingWorkflow) {
			throw new WorkflowNotFoundException()
		}

		const { icon_id } = dto
		// option 1: if user provide new icon_id in DTO, fetch icon accordingly,
		// else fetch original icon from existing workflow with workflow mapper to turn workflow domain => workflow entity
		// const icon = dto.icon_id
		// 	? await this.iconRepo.getIcon(dto.icon_id)
		// 	: await this.mapper.toOrm(existingWorkflow).icon

		// option 2: if user provide new icon_id, update with existing workflow with new icon,
		// else ignore update icon
		if (icon_id) {
			const icon = await this.iconRepo.getIcon(icon_id)

			existingWorkflow.update(dto, icon)
		} else {
			existingWorkflow.update(dto)
		}

		await this.workflowRepo.save(existingWorkflow)

		return { workflow: existingWorkflow.serialize() }
	}

	@Delete(':id')
	@ApiOperation({ summary: 'Detele a workflow' })
	@ApiParam({
		description: 'Enter workflow ID',
		name: 'id',
	})
	@ApiResponse({
		status: 200,
		type: DeleteWorkflowResponseDTO,
	})
	async delete(@Param('id') id: number): Promise<SuccessResponseDTO> {
		const deleteSuccess = await this.workflowRepo.delete(id)

		if (!deleteSuccess) {
			throw new WorkflowNotFoundException()
		}

		return {
			resultCode: ResultCode.Success,
		}
	}
}
