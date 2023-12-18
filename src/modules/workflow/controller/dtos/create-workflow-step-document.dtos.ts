import { SuccessResponseDTO } from '@libs'
import { ApiProperty, PartialType } from '@nestjs/swagger'
import {
	Allow,
	ArrayNotEmpty,
	IsArray,
	IsNotEmpty,
	IsOptional,
	Length,
	Matches,
	ValidateNested,
} from 'class-validator'
import { CreateStepRequestDTO } from 'src/modules/step/controller/dtos/create-step.dtos'
import { WorkflowDto } from './workflow.dtos'
import { Transform, Type } from 'class-transformer'

export class CreateWorkflowStepDocumentRequestDTO {
	@ApiProperty()
	@Length(5, 20, {
		message: ({ constraints }) =>
			`Workflow name must be between ${constraints[0]} and ${constraints[1]} characters`,
	})
	@Matches(/^[a-zA-Z0-9\s]+$/, {
		message: `Workflow name can't contain specical characters`,
	})
	@Transform(({ value }) => value.trim())
	@IsNotEmpty({
		message:
			'Workflow name cannot be empty. Please fill in the context and try again!',
	})
	name: string

	@ApiProperty()
	@Transform(({ value }) => value.trim())
	@Length(1, 200, {
		message: ({ constraints }) =>
			`Description exceeded character limit of ${constraints[1]} characters`,
	})
	description: string

	@ApiProperty()
	@IsNotEmpty({ message: 'Please provide appropiate Icon' })
	icon_id: number

	@ApiProperty({ type: () => [CreateStepRequestDTO] })
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => CreateStepRequestDTO)
	@IsOptional()
	steps?: CreateStepRequestDTO[]
}

export class CreateWorkflowResponseDTO extends PartialType(SuccessResponseDTO) {
	@ApiProperty({ type: () => WorkflowDto })
	workflow: WorkflowDto
}
