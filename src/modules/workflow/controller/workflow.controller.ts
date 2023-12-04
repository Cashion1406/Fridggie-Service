import {
	Body,
	ClassSerializerInterceptor,
	Controller,
	Delete,
	Get,
	HttpCode,
	Param,
	Patch,
	Post,
	Query,
	UseInterceptors,
} from '@nestjs/common'
import { ApiResponse, ApiTags } from '@nestjs/swagger'
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

@Controller()
@ApiTags('Workflow')
@UseInterceptors(ClassSerializerInterceptor)
export class WorkflowController {
	constructor(
		private readonly workflowRepo: WorkflowRepository,
		private readonly iconRepo: IconRepository,
	) {}

	//Get list of flows
	@Get('/workflows')
	@HttpCode(200)
	@ApiResponse({
		status: 200,
		type: WorkflowDto,
	})
	async getAllFlow(): Promise<WorkflowDto[]> {
		return this.workflowRepo.getAllWorkflow()
	}

	//Get a flow details
	@Get('/workflow/:id')
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
	@Get('/workflows/search')
	@ApiResponse({
		status: 200,
		type: WorkflowDto,
	})
	async searchWorkflows(
		@Query() filterDTO: FilterWorkflowDTO,
	): Promise<WorkflowDto[]> {
		return await this.workflowRepo.searchWorkflow(filterDTO)
	}

	@Post('/workflow')
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

	@Patch('/workflow/:id')
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

	@Delete('/workflow/:id')
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
	// hello
}
