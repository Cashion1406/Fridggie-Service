import { ApiProperty } from '@nestjs/swagger'
import { Exclude, Type } from 'class-transformer'
import { ValidateNested } from 'class-validator'
import { IconDTO } from 'src/modules/icon/controller/dtos/icon.dtos'
import { StepDTO } from 'src/modules/step/controller/dtos/step.dtos'

export class WorkflowDto {
	constructor(props: Partial<WorkflowDto>) {
		Object.assign(this, props)
	}

	@ApiProperty()
	id: number

	@ApiProperty()
	name: string

	@ApiProperty()
	icon: IconDTO

	@Exclude()
	createdAt?: Date

	@Exclude()
	updatedAt?: Date
}
