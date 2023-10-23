import { ApiProperty, PartialType } from '@nestjs/swagger'
import { IsNotEmpty, IsNumber, IsPositive } from 'class-validator'
import { ProductDTO } from './product.dtos'
import { SuccessResponseDTO } from '@libs'

export class CreateProductRequestDTO {
	@ApiProperty()
	@IsNotEmpty()
	name: string

	@ApiProperty()
	@IsNotEmpty()
	@IsNumber()
	@IsPositive()
	price: number
}

export class CreateProductResponseDTO extends PartialType(SuccessResponseDTO) {
	@ApiProperty({ type: () => ProductDTO })
	product: ProductDTO
}
