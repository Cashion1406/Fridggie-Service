import { SuccessResponseDTO } from '@libs'
import { ApiProperty, PartialType } from '@nestjs/swagger'
import { IsNotEmpty, Length } from 'class-validator'
import { WorkflowDto } from './workflow.dtos'

export class CreateWorkflowRequestDTO {
	@ApiProperty()
	@Length(5, 20, {
		message: 'Workflow name must be between 0 and 20 characters',
	})
	@IsNotEmpty({
		message:
			'Workflow name cannot be empty. Please fill in the context again!',
	})
	name: string

	@ApiProperty()
	@Length(0, 200, { message: 'Description exceeded character limit' })
	description: string

	@ApiProperty()
	@IsNotEmpty({ message: 'Please provide appropiate Icon' })
	icon_id: number
}

export class CreateWorkflowResponseDTO extends PartialType(SuccessResponseDTO) {
	@ApiProperty({ type: () => WorkflowDto })
	workflow: WorkflowDto
}
