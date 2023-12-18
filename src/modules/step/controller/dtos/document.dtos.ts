import { ApiProperty } from '@nestjs/swagger'
import { Exclude, Transform, Type } from 'class-transformer'

export class DocumentDTO {
	constructor(props: Partial<DocumentDTO>) {
		Object.assign(this, props)
	}

	@ApiProperty()
	id: number

	@ApiProperty()
	name: string

	@ApiProperty()
	url: string

	@ApiProperty()
	type: string

	@Exclude()
	createdAt?: Date

	@Exclude()
	updatedAt?: Date
}
