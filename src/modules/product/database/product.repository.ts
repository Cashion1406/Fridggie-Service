import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { ProductEntity } from './entities/product.entity'
import { Repository } from 'typeorm'
import { Product } from '../domain/product'
import { ProductMapper } from './mappers/product.mapper'
import { IQueryableProductRepository } from './interfaces'

@Injectable()
export class ProductRepository implements IQueryableProductRepository {
	private readonly mapper: ProductMapper = new ProductMapper()
	constructor(
		@InjectRepository(ProductEntity)
		private readonly productRepo: Repository<ProductEntity>,
	) {}

	queryById(id: number): Promise<ProductEntity> {
		return this.productRepo.findOne({
			where: {
				id,
			},
		})
	}

	async save(product: Product): Promise<Product> {
		const entity = this.mapper.toOrm(product)
		const result = await this.productRepo.save(entity)

		return this.mapper.toDomain(result)
	}

	async getById(id: number) {
		const entity = await this.productRepo.findOne({
			where: {
				id,
			},
		})

		return entity ? this.mapper.toDomain(entity) : null
	}

	async delete(id: number): Promise<boolean> {
		const result = await this.productRepo.delete(id)
		return result.affected > 0 ? true : false
	}

	async getByName(name: string) {
		const entity = await this.productRepo.findOne({
			where: {
				name,
			},
		})

		return entity ? this.mapper.toDomain(entity) : null
	}
}
