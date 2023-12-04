import {
	ClassSerializerInterceptor,
	Controller,
	UseInterceptors,
	Get,
	Param,
	Post,
	Body,
	Patch,
} from '@nestjs/common'
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger'
import { StepRepository } from '../database/step.repository'
import { StepDTO } from './dtos/step.dtos'
import { WorkflowRepository } from 'src/modules/workflow/database/workflow.repository'
import { WorkflowNotFoundException } from 'src/modules/workflow/exceptions/workflow.exceptions'
import {
	StepExistsException,
	StepNotFoundException,
} from '../exception/step.exceptions'
import {
	CreateStepRequestDTO,
	CreateStepResponseDTO,
} from './dtos/create-step.dtos'
import { Step } from '../domain/step'
import { UserRepository } from 'src/modules/user/database/user.repository'
import { UserNotFoundException } from 'src/modules/user/exception/user.exceptions'
import {
	UpdateStepRequestDTO,
	UpdateStepResponseDTO,
} from './dtos/update-step.dtos'

@Controller()
@ApiTags('Steps')
@UseInterceptors(ClassSerializerInterceptor)
export class StepController {
	constructor(
		private readonly stepRepo: StepRepository,
		private readonly userRepo: UserRepository,
		private readonly workflowRepo: WorkflowRepository,
	) {}

	@Get('/workflow/:id/step')
	@ApiOperation({ summary: 'Get all steps belong to provided workflow' })
	@ApiParam({
		description: 'Enter workflow ID',
		name: 'id',
	})
	@ApiResponse({
		status: 200,
		type: StepDTO,
	})
	async getStepsByWorkflowId(@Param('id') id: number): Promise<StepDTO[]> {
		const workflow = await this.stepRepo.getWorkFlow(id)

		if (!workflow) {
			throw new WorkflowNotFoundException()
		}

		return this.stepRepo.getAllStepFromWorkflow(id)
	}

	@Get('step/:id')
	@ApiOperation({ summary: 'Get step details' })
	@ApiResponse({
		status: 200,
		type: StepDTO,
	})
	async getStepById(@Param('id') id: number): Promise<StepDTO> {
		const step = await this.stepRepo.queryById(id)

		if (!step) {
			throw new StepNotFoundException()
		}

		return new StepDTO(step)
	}

	@Patch('/step/:id')
	@ApiOperation({ summary: 'Update Step with ID' })
	@ApiParam({
		description: 'Enter step ID',
		name: 'id',
	})
	@ApiResponse({
		status: 200,
		type: UpdateStepResponseDTO,
	})
	async updateStep(
		@Param('id') id: number,
		@Body() dto: UpdateStepRequestDTO,
	): Promise<UpdateStepResponseDTO> {
		const existStep = await this.stepRepo.getStepById(id)
		if (!existStep) throw new StepNotFoundException()

		const { owner_id } = dto

		if (owner_id) {
			const new_owner = await this.userRepo.getUserById(owner_id)
			existStep.update(dto, new_owner)
		} else {
			existStep.update(dto)
		}

		await this.stepRepo.save(existStep)
		return {
			step: existStep.serialize(),
		}
	}
}
