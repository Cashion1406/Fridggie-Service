import { Controller, Get, Param, Res } from '@nestjs/common'
import { IconRepository } from '../database/icon.repository'
import axios from 'axios'
import { Response } from 'express'
import { Repository } from 'typeorm'

@Controller('setIcon')
export class IconController {
	constructor(private readonly IconRepository: IconRepository) {}

	@Get()
	listAll() {
		return this.IconRepository.getlistIcon()
	}

	@Get(':url(*)')
	async getImages(@Param('url') url, @Res() res: Response) {
		// Get image from img.freepik.com
		const repsonse = await axios.get(url, { responseType: 'arraybuffer' }) // axios will get this url and up to server, in server will make it to raw data
		const buffer = Buffer.from(repsonse.data, 'utf-8') // buffer will get this raw data

		// Edit this buffer as image
		res.setHeader('Content-Type', 'image/jpeg') // Set the appropriate content type based on your image format
		res.setHeader('Content-Length', buffer.length)
		res.end(buffer) // Send image back

		return url
	}
}
