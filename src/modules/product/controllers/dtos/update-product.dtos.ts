import { ApiProperty, PartialType } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'
import { ProductDTO } from './product.dtos'
import { SuccessResponseDTO } from '@libs'

export class UpdateProductRequestDTO {
	@ApiProperty()
	@IsNotEmpty()
	price: number
}

export class UpdateProductResponseDTO extends PartialType(SuccessResponseDTO) {
	@ApiProperty({ type: () => ProductDTO })
	product: ProductDTO
}
