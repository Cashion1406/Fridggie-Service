/* eslint-disable prettier/prettier */

import { SuccessResponseDTO } from '@libs'
import { ApiProperty, PartialType } from '@nestjs/swagger'
import { IsNotEmpty, Length } from 'class-validator'
import { ProductDTO } from 'src/modules/product/controllers/dtos/product.dtos'
import { WorkflowDto } from './workflow.dtos'


export class CreateWorkflowRequestDTO {
	
	@ApiProperty()
	@IsNotEmpty({message:'Workflow name cannot be empty. Please fill in the context again!'})
	@Length(5,20,{message:'Workflow name must be between 2 and 50 characters'})
	name: string

	@ApiProperty()
	@Length(0,200,{message:'Description exceeded character limit'})
	description:string

}

export class CreateWorkflowResponseDTO extends PartialType(SuccessResponseDTO) {
	@ApiProperty({ type: () => WorkflowDto })
	workflow: WorkflowDto
}
