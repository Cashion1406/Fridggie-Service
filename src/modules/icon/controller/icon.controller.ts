/* eslint-disable prettier/prettier */
import { ClassSerializerInterceptor, Controller, Get, HttpException, NotFoundException, Param, Res, UseInterceptors } from '@nestjs/common'
import { IconRepository } from '../database/icon.repository'
import axios, { AxiosError } from 'axios'
import { Response } from 'express'
import { Repository } from 'typeorm'
import { ApiResponse, ApiTags } from '@nestjs/swagger'
import { IconDTO } from './dtos/icon.dtos'
import { IconNotFoundException } from '../exceptions/icon.exception'

@Controller('icon')
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

	@Get(':url(*)')
	@ApiResponse({
		status: 200,
		type: Response,
	})
	async getImages(@Param('url') url:string, @Res() res: Response) {
		// Get image from img.freepik.com
		try {
			const repsonse = await axios.get(url, { responseType: 'arraybuffer' }) // axios will get this url and up to server, in server will make it to raw data
			const buffer = Buffer.from(repsonse.data, 'utf-8') // buffer will get this raw data
	
			if (!repsonse) throw new IconNotFoundException
	
			// Edit this buffer as image
			res.setHeader('Content-Type', 'image/jpeg') // Set the appropriate content type based on your image format
			res.setHeader('Content-Length', buffer.length)
			res.end(buffer) // Send image back
	
			return url
		}
		catch(err){
			if(axios.isAxiosError(err) && err.code === 'ECONNREFUSED'){
					throw new IconNotFoundException
				}
			}		
		}
	
	}

	

