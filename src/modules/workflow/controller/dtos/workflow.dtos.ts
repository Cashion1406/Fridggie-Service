/* eslint-disable prettier/prettier */

import { ApiProperty } from "@nestjs/swagger"
import { Exclude } from "class-transformer"

export class WorkflowDto {
    constructor(props: Partial<WorkflowDto>) {
		Object.assign(this, props)
	}

    @ApiProperty()
	id: number

	@ApiProperty()
	name: string

	@Exclude()
	createdAt?: Date

	@Exclude()
	updatedAt?: Date

}
