import { BaseException } from '@libs'

export class ProductExistsException extends BaseException {
	public code = 'PRODUCT_ALREADY_EXISTS'

	constructor() {
		super('Product already exists')
	}
}

export class ProductNotFoundException extends BaseException {
	code = 'PRODUCT_NOT_FOUND'

	constructor() {
		super('Product not found')
	}
}
