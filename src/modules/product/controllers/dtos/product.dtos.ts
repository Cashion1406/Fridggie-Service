import { ApiProperty } from '@nestjs/swagger'
import { Exclude, Transform } from 'class-transformer'

export class ProductDTO {
	@ApiProperty()
	id: number

	@ApiProperty()
	name: string

	@ApiProperty()
	price: number

	@Exclude()
	createdAt?: Date

	@Exclude()
	updatedAt?: Date

	constructor(props: Partial<ProductDTO>) {
		Object.assign(this, props)
	}
}
