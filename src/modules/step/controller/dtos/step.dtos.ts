import { ApiProperty } from '@nestjs/swagger'
import { Exclude, Transform, Type } from 'class-transformer'
import { UserDTO } from 'src/modules/user/controller/dtos/user.dtos'
import { DocumentDTO } from './document.dtos'

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

	@ApiProperty({ type: () => UserDTO })
	@Type(() => UserDTO)
	// @Transform(({value}) =>value.name)
	owner: UserDTO

	@ApiProperty({ type: () => DocumentDTO })
	@Type(() => DocumentDTO)
	documents?: DocumentDTO[]

	@Exclude()
	createdAt?: Date

	@Exclude()
	updatedAt?: Date
}
