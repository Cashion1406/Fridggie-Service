import { SuccessResponseDTO } from '@libs'
import { ApiProperty, PartialType } from '@nestjs/swagger'
import { IsNotEmpty, Length } from 'class-validator'
import { StepDTO } from './step.dtos'

export class CreateStepRequestDTO {
	@ApiProperty()
	@Length(2, 50, { message: 'Step name must be between 2 and 50 characters' })
	@IsNotEmpty({ message: 'Step name is required' })
	name: string

	@ApiProperty()
	@Length(0, 200, {
		message: ({ constraints }) =>
			`Description exceeded characters limit of ${constraints[1]} c`,
	})
	@IsNotEmpty({ message: 'Please provide a short description' })
	description: string

	@ApiProperty()
	@IsNotEmpty({ message: 'A user must be assigned to the step' })
	owner_id: number
}

export class CreateStepResponseDTO extends PartialType(SuccessResponseDTO) {
	@ApiProperty()
	@IsNotEmpty()
	step: StepDTO
}
