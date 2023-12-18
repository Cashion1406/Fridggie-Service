import { SuccessResponseDTO } from '@libs'
import { ApiProperty, PartialType } from '@nestjs/swagger'
import { IsOptional, IsNotEmpty } from 'class-validator'
import { StepDTO } from './step.dtos'

export class UpdateStepRequestDTO {
	@ApiProperty()
	@IsNotEmpty()
	@IsOptional()
	name: string

	@ApiProperty()
	@IsNotEmpty()
	@IsOptional()
	description: string

	@ApiProperty({ required: false })
	@IsOptional()
	owner_id: number
}
export class UpdateStepResponseDTO extends PartialType(SuccessResponseDTO) {
	@ApiProperty({ type: () => StepDTO })
	step: StepDTO
}
