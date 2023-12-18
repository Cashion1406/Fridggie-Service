import {
	ClassSerializerInterceptor,
	Controller,
	UseInterceptors,
	Get,
	Query,
} from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { UserRepository } from '../database/user.repository'
import { UserDTO } from './dtos/user.dtos'

@Controller('users')
@ApiTags('User')
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
	constructor(private readonly userRepo: UserRepository) {}

	@Get()
	@ApiOperation({
		summary: 'Get all users',
	})
	@ApiResponse({
		status: 200,
		type: [UserDTO],
	})
	async getAllUser(): Promise<UserDTO[]> {
		return this.userRepo.getAllUser()
	}
}
