import {
	Body,
	Controller,
	Post,
	Logger,
	Get,
	Param,
	Put,
	Delete,
	HttpCode,
	ClassSerializerInterceptor,
	UseInterceptors,
	SerializeOptions,
} from '@nestjs/common'
import { ApiResponse, ApiTags, getSchemaPath } from '@nestjs/swagger'
import {
	CreateProductRequestDTO,
	CreateProductResponseDTO,
} from './dtos/create-product.dtos'
import { ProductRepository } from '../database'
import {
	ProductExistsException,
	ProductNotFoundException,
} from '../exceptions/product.exceptions'
import { Product } from '../domain'
import { ProductDTO } from './dtos/product.dtos'
import {
	UpdateProductRequestDTO,
	UpdateProductResponseDTO,
} from './dtos/update-product.dtos'
import { DeleteProductResponseDTO } from './dtos/delete-product.dtos'
import { ErrorResponseDTO, SuccessResponseDTO } from '@libs'
import { ResultCode } from 'src/libs/enums/result-code.enum'

@Controller('/products')
@ApiTags('Products')
@ApiResponse({
	status: 400,
	type: ErrorResponseDTO,
})
@UseInterceptors(ClassSerializerInterceptor)
export class ProductController {
	constructor(private readonly productRepo: ProductRepository) {}

	@Post()
	@HttpCode(201)
	@ApiResponse({
		status: 201,
		type: CreateProductResponseDTO,
	})
	async create(
		@Body() dto: CreateProductRequestDTO,
	): Promise<CreateProductResponseDTO> {
		const existingProduct = await this.productRepo.getByName(dto.name)

		if (existingProduct) {
			throw new ProductExistsException()
		}

		let product = Product.createNew(dto.name, dto.price)

		try {
			product = await this.productRepo.save(product)
			return {
				product: product.serialize(),
			}
		} catch (error) {
			Logger.error(error.message, error.stack)
			throw new ProductExistsException()
		}
	}

	@Get('/:id')
	@ApiResponse({
		status: 200,
		type: ProductDTO,
	})
	async getById(@Param('id') id: number): Promise<ProductDTO> {
		const product = await this.productRepo.queryById(id)

		if (!product) {
			throw new ProductNotFoundException()
		}

		return new ProductDTO(product)
	}

	@Put('/:id')
	@ApiResponse({
		status: 200,
		type: UpdateProductResponseDTO,
	})
	async update(
		@Param('id') id: number,
		@Body() dto: UpdateProductRequestDTO,
	): Promise<UpdateProductResponseDTO> {
		const { price } = dto
		const product = await this.productRepo.getById(id)

		if (!product) {
			throw new ProductNotFoundException()
		}

		product.update(price)

		await this.productRepo.save(product)

		return {
			product: product.serialize(),
		}
	}

	@Delete('/:id')
	@ApiResponse({
		status: 200,
		type: DeleteProductResponseDTO,
	})
	async delete(@Param('id') id: number): Promise<SuccessResponseDTO> {
		const deleteSuccess = await this.productRepo.delete(id)

		if (!deleteSuccess) {
			throw new ProductNotFoundException()
		}

		return {
			resultCode: ResultCode.Success,
		}
	}
}
