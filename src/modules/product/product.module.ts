import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ProductEntity, ProductRepository } from './database'
import { ProductController } from './controllers'

@Module({
	imports: [TypeOrmModule.forFeature([ProductEntity])],
	providers: [ProductRepository],
	controllers: [ProductController],
})
export class ProductModule {}
