import { SuccessResponseDTO } from '@libs'
import { ApiProperty, PartialType } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'
import { ProductDTO } from 'src/modules/product/controllers/dtos/product.dtos'
import { WorkflowDto } from './workflow.dtos'

export class UpdateWorkflowRequestDTO {
	@ApiProperty()
	@IsNotEmpty()
	name: string

	@ApiProperty()
	@IsNotEmpty()
	description: string

	@ApiProperty({ required: false })
	icon_id: number
}

export class UpdateWorkflowResponseDTO extends PartialType(SuccessResponseDTO) {
	@ApiProperty({ type: () => WorkflowDto })
	workflow: WorkflowDto
}
