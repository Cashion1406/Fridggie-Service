import { Product } from '../../domain'
import { ProductEntity } from '../entities/product.entity'

export class ProductMapper {
	toDomain(product: ProductEntity) {
		return new Product({
			id: product.id,
			name: product.name,
			price: product.price,
		})
	}

	toOrm(product: Product) {
		return new ProductEntity(product.serialize())
	}
}
