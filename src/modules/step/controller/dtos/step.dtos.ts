import { ApiProperty } from '@nestjs/swagger'
import { Exclude, Transform, Type } from 'class-transformer'
import { UserDTO } from 'src/modules/user/controller/dtos/user.dtos'

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

	@ApiProperty()
	// @Type(()=>UserDTO)
	// @Transform(({value}) =>value.name)
	owner: UserDTO

	@ApiProperty()
	order: number

	@Exclude()
	createdAt?: Date

	@Exclude()
	updatedAt?: Date
}
