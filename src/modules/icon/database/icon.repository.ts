/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common'
import { Repository } from 'typeorm'
import { IconEntity } from './entities/icon.entity'
import { InjectRepository } from '@nestjs/typeorm'
@Injectable()
export class IconRepository {
	constructor(
		@InjectRepository(IconEntity)
		private readonly iconRepo: Repository<IconEntity>,
	) {}

	getIcon(id:number):Promise<IconEntity>{
		return this.iconRepo.findOneBy({id})
	}

	
	getListIcon(): Promise<IconEntity[]> {
		return this.iconRepo.find()
	}
}
