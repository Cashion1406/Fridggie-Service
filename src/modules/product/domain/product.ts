export interface ProductProps {
	id: number
	name: string
	price: number
}

export class Product {
	private id: number
	private name: string
	private price: number

	constructor(props: ProductProps) {
		Object.assign(this, props)
	}

	update(price: number) {
		this.price = price
	}

	/**
	 * Get a plain object of the domain entity without directly accessing to it. Useful when you want to convert it to JSON
	 * @returns {Record<string, any>}
	 */
	serialize() {
		return {
			id: this.id,
			name: this.name,
			price: this.price,
		}
	}

	static createNew(name: string, price: number) {
		return new Product({
			id: null,
			name,
			price,
		})
	}
}
