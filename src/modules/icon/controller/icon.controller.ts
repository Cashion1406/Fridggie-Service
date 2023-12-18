import {
	ClassSerializerInterceptor,
	Controller,
	Get,
	UseInterceptors,
} from '@nestjs/common'
import { IconRepository } from '../database/icon.repository'
import { ApiResponse, ApiTags } from '@nestjs/swagger'
import { IconDTO } from './dtos/icon.dtos'

@Controller('icons')
@ApiTags('Icon')
@UseInterceptors(ClassSerializerInterceptor)
export class IconController {
	constructor(private readonly iconRepo: IconRepository) {}

	@Get()
	@ApiResponse({
		status: 200,
		type: IconDTO,
	})
	async getAllIcon() {
		const icon = await this.iconRepo.getListIcon()

		return icon.map((iconentity) => new IconDTO(iconentity))
	}
}
