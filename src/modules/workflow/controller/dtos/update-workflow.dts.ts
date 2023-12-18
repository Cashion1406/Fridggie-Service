import { SuccessResponseDTO } from '@libs'
import { ApiProperty, PartialType } from '@nestjs/swagger'
import {
	IsNotEmpty,
	IsNumber,
	IsOptional,
	Length,
	Matches,
} from 'class-validator'
import { ProductDTO } from 'src/modules/product/controllers/dtos/product.dtos'
import { WorkflowDto } from './workflow.dtos'
import { Transform } from 'class-transformer'

export class UpdateWorkflowRequestDTO {
	@ApiProperty()
	@Matches(/^[a-zA-Z0-9\s]+$/, {
		message: `Workflow name can't contain specical characters`,
	})
	@Transform(({ value }) => value.trim())
	@IsOptional()
	name: string

	@ApiProperty()
	@Transform(({ value }) => value.trim())
	@Length(0, 200, {
		message: ({ constraints }) =>
			`Description exceeded character limit of ${constraints[1]} characters`,
	})
	@IsOptional()
	description: string

	@ApiProperty({ required: false })
	@IsNumber({}, { message: 'Please provide valid Icon ID' })
	@IsOptional()
	icon_id: number
}

export class UpdateWorkflowResponseDTO extends PartialType(SuccessResponseDTO) {
	@ApiProperty({ type: () => WorkflowDto })
	workflow: WorkflowDto
}
