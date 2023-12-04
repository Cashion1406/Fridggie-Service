import { ApiProperty } from '@nestjs/swagger'
import { Exclude, Type } from 'class-transformer'
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

	@ApiProperty({ type: () => IconDTO })
	@Type(() => IconDTO)
	icon: IconDTO

	@ApiProperty({ type: () => StepDTO })
	@Type(() => StepDTO)
	steps?: StepDTO[]

	@Exclude()
	createdAt?: Date

	@Exclude()
	updatedAt?: Date
}
