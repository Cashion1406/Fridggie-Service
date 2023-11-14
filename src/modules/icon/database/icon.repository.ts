import { Injectable } from '@nestjs/common'
import { Repository } from 'typeorm'
import { IconEntity } from './entities/icon.entity'
import { InjectRepository } from '@nestjs/typeorm'
@Injectable()
export class IconRepository {
	constructor(
		@InjectRepository(IconEntity)
		private readonly myRepo: Repository<IconEntity>,
	) {}

	getlistIcon(): Promise<IconEntity[]> {
		return this.myRepo.find()
	}
}
