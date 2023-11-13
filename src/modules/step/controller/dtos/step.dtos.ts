/* eslint-disable prettier/prettier */


import { ApiProperty } from '@nestjs/swagger'
import { Exclude } from 'class-transformer'
import { WorkflowDto } from 'src/modules/workflow/controller/dtos/workflow.dtos'
import { StepEntity } from '../../database/entities/step.entity'


export class StepDTO {
	constructor(props: Partial<StepDTO>) {
		Object.assign(this, props)
	}

	@ApiProperty()
	id: number

	@ApiProperty()
	name: string

    @ApiProperty()
    description: string

   
	@Exclude()
	createdAt?: Date

	@Exclude()
	updatedAt?: Date

}

