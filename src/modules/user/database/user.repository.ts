/* eslint-disable prettier/prettier */
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { WorkflowEntity } from "src/modules/workflow/database/entities/workflow.entity";
import { WorkflowMapper } from "src/modules/workflow/database/mappers/workflow.mapper";
import { Repository } from "typeorm";
import { UserEntity } from "./entities/user.entity";

@Injectable()
export class UserRepository {
    constructor(
		@InjectRepository(UserEntity)
		private readonly userRepo: Repository<UserEntity>
	) {}

    async getUserById(id: number):Promise<UserEntity> {
		return await this.userRepo.findOneBy({id})
	}
    
}
