import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { IconController } from './controller'
import { IconEntity, IconRepository } from './database'

@Module({
	imports: [TypeOrmModule.forFeature([IconEntity])],

	providers: [IconRepository],
	controllers: [IconController],
})
export class IconModule {}
