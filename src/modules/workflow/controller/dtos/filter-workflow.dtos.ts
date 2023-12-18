import { ApiProperty } from '@nestjs/swagger'
import { IsOptional, IsString } from 'class-validator'

export class FilterWorkflowDTO {
	@ApiProperty({ required: false })
	@IsOptional()
	@IsString()
	name?: string

	@ApiProperty({ required: false })
	@IsOptional()
	@IsString()
	description?: string

	@ApiProperty({ required: false })
	@IsOptional()
	@IsString()
	keywords?: string
}
