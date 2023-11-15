/* eslint-disable prettier/prettier */

import { ApiProperty } from "@nestjs/swagger"
import { Exclude } from "class-transformer"
import { IconDTO } from "src/modules/icon/controller/dtos/icon.dtos"

export class WorkflowDto {
    constructor(props: Partial<WorkflowDto>) {
		Object.assign(this, props)
	}

    @ApiProperty()
	id: number

	@ApiProperty()
	name: string

	@ApiProperty()
	icon:IconDTO

	@Exclude()
	createdAt?: Date

	@Exclude()
	updatedAt?: Date

}
