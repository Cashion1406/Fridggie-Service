/* eslint-disable prettier/prettier */
import { ClassSerializerInterceptor, Controller, Get, HttpException, NotFoundException, Param, Res, UseInterceptors } from '@nestjs/common'
import { IconRepository } from '../database/icon.repository'
import axios, { AxiosError } from 'axios'
import { Response } from 'express'
import { Repository } from 'typeorm'
import { ApiResponse, ApiTags } from '@nestjs/swagger'
import { IconDTO } from './dtos/icon.dtos'
import { IconNotFoundException } from '../exceptions/icon.exception'

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
	async getAllIcon(){
		const icon = await this.iconRepo.getListIcon()
		
		return icon.map(iconentity=> new IconDTO(iconentity))
	}
	
	}

	

