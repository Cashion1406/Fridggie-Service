import { ProductEntity } from './entities/product.entity'

export interface IQueryableProductRepository {
	queryById(id: number): Promise<ProductEntity>
}
