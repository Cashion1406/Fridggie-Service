import { SuccessResponseDTO } from '@libs'
import { ApiProperty, PartialType } from '@nestjs/swagger'
import {
	IsArray,
	IsEnum,
	IsNotEmpty,
	IsOptional,
	Length,
	Matches,
	ValidateNested,
} from 'class-validator'
import { StepDTO } from './step.dtos'
import { CreateDocumentRequestDTO } from './create-document.dtos'
import { Transform, Type } from 'class-transformer'

export class CreateStepRequestDTO {
	@ApiProperty()
	@Length(2, 50, { message: 'Step name must be between 2 and 50 characters' })
	@Matches(/^[a-zA-Z0-9\s]+$/, {
		message: `Step name can't contain specical characters`,
	})
	@Transform(({ value }) => value.trim())
	@IsNotEmpty({ message: 'Step name is required' })
	name: string

	@ApiProperty()
	@Length(0, 200, {
		message: ({ constraints }) =>
			`Description exceeded characters limit of ${constraints[1]} characters`,
	})
	@Transform(({ value }) => value.trim())
	@IsNotEmpty({ message: 'Please provide a short description' })
	description: string

	@ApiProperty({ required: true, description: 'Please provide a User' })
	@IsNotEmpty({ message: 'A user must be assigned to the step' })
	owner_id: number

	@ApiProperty({ type: () => [CreateDocumentRequestDTO] })
	@IsArray()
	@IsOptional()
	@ValidateNested({ each: true })
	@Type(() => CreateDocumentRequestDTO)
	documents?: CreateDocumentRequestDTO[]
}

export class CreateStepResponseDTO extends PartialType(SuccessResponseDTO) {
	@ApiProperty()
	@Type(() => StepDTO)
	step: StepDTO
}
