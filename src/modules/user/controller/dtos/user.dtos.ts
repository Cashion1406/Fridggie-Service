import { ApiProperty } from '@nestjs/swagger/dist/decorators/api-property.decorator'

export class UserDTO {
	constructor(props: Partial<UserDTO>) {
		Object.assign(this, props)
	}

	@ApiProperty()
	id: number

	@ApiProperty()
	name: string
}
