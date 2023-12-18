/* eslint-disable prettier/prettier */
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { WorkflowEntity } from "src/modules/workflow/database/entities/workflow.entity";
import { WorkflowMapper } from "src/modules/workflow/database/mappers/workflow.mapper";
import { Repository } from "typeorm";
import { UserEntity } from "./entities/user.entity";
import { UserDTO } from "../controller/dtos/user.dtos";

@Injectable()
export class UserRepository {
    constructor(
		@InjectRepository(UserEntity)
		private readonly userRepo: Repository<UserEntity>
	) {}

    async getUserById(id: number):Promise<UserEntity> {
		return await this.userRepo.findOneBy({id})
	}

	async getAllUser():Promise<UserDTO[]>{
		const user = await this.userRepo.find()
		return user.map(data=> new UserDTO(data))
	}
    
}
