/* eslint-disable prettier/prettier */
import { SuccessResponseDTO } from "@libs"
import { ApiProperty, PartialType } from "@nestjs/swagger"
import { Allow, ArrayNotEmpty, IsArray, IsNotEmpty, IsOptional, Length, Matches, ValidateNested } from "class-validator"
import { CreateStepRequestDTO } from "src/modules/step/controller/dtos/create-step.dtos"
import { WorkflowDto } from "./workflow.dtos"
import { Type } from "class-transformer"

export class CreateWorkflowStepRequestDTO{
    @ApiProperty()
	@Length(5,20,{message:'Workflow name must be between 0 and 20 characters'})
	@Matches(/^[a-zA-Z0-9\s]+$/, {
		message: `Workflow name can't contain specical characters`,
	})
	@IsNotEmpty({message:'Workflow name cannot be empty. Please fill in the context and try again!'})
	name: string

	@ApiProperty()
	@Length(1,200,{message:'Description exceeded character limit'})
	description:string

	@ApiProperty()
	@IsNotEmpty({message:'Please provide appropiate Icon'})
	icon_id:number

  
	
    @Allow()
    @ApiProperty({type:()=>[CreateStepRequestDTO]})
	@IsArray()
    @ValidateNested({each:true})
    @Type(()=>CreateStepRequestDTO)
    steps: CreateStepRequestDTO[]
}

export class CreateWorkflowStepResponseDTO extends PartialType(SuccessResponseDTO) {
	@ApiProperty({ type: () => WorkflowDto })
	workflow: WorkflowDto
}

