/* eslint-disable prettier/prettier */
import { ClassSerializerInterceptor, Controller, UseInterceptors,Get, Query } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserRepository } from '../database/user.repository';
import { UserDTO } from './dtos/user.dtos';

@Controller('user')
@ApiTags('User')
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
    constructor(
		private readonly userRepo: UserRepository,
	) {}

    @Get()
	@ApiResponse({
		status: 200,
		type: UserDTO,
	})
	async getAllFlow(@Query() name:string): Promise<UserDTO[]> {
		return this.userRepo.getAllUser(name)
	}


}
