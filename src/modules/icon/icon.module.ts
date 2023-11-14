import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { IconEntity } from './database/entities/icon.entity'
import { IconRepository } from './database/icon.repository'
import { IconController } from './controller/icon.controller'
import { ServeStaticModule } from '@nestjs/serve-static'
import { join } from 'path'

@Module({
	imports: [
		ServeStaticModule.forRoot({
			rootPath: join(__dirname, '..', '..', '..', 'public'), // serve static for image png logo in foler public
		}),
		TypeOrmModule.forFeature([IconEntity]),
	],

	providers: [IconRepository],
	controllers: [IconController],
})
export class IconModule {}
