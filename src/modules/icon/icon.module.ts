import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ServeStaticModule } from '@nestjs/serve-static'
import { join } from 'path'
import { IconController } from './controller'
import { IconEntity, IconRepository } from './database'

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
