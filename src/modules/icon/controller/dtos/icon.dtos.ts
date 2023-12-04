/* eslint-disable prettier/prettier */

import { ApiProperty } from '@nestjs/swagger'


export class IconDTO {

    constructor(props: Partial<IconDTO>) {
		Object.assign(this, props)
	}

    @ApiProperty()
	id: number

	@ApiProperty()
	path: string
}
