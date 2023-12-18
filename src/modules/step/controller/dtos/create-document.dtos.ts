import { SuccessResponseDTO } from '@libs'
import { ApiProperty, PartialType } from '@nestjs/swagger'
import { IsEnum, IsNotEmpty, Length, Matches } from 'class-validator'
import { DocumentDTO } from './document.dtos'
import { Transform, Type } from 'class-transformer'
import { DocumentType } from '../../enums/document-type.enum'

export class CreateDocumentRequestDTO {
	@ApiProperty()
	@Length(2, 50, {
		message: ({ constraints }) =>
			`Document name must be between ${constraints[0]} and ${constraints[1]} characters`,
	})
	@Matches(/^[a-zA-Z0-9\s]+$/, {
		message: `Document name can't contain specical characters`,
	})
	@IsNotEmpty({ message: 'Document name is required' })
	name: string

	@ApiProperty({
		type: () => DocumentType,
		enum: DocumentType,
		description: 'Please provide document type',
	})
	@Transform(({ value }) => value.trim().toUpperCase())
	@IsEnum(DocumentType, {
		message: `Invalid document type. Must be ${Object.values(
			DocumentType,
		)[0].toLowerCase()} or ${Object.values(
			DocumentType,
		)[1].toLowerCase()} type`,
	})
	@IsNotEmpty({ message: 'Please select document type' })
	type: DocumentType

	// @ApiProperty()
	// @IsString({ message: ' Must be a string of URL' })
	// @IsUrl(
	// 	{ protocols: ['http', 'https'] },
	// 	{ message: 'Invalid URL, please try again' },
	// )
	// @IsOptional()
	// url: string
}

export class CreateDocumentResponseDTO extends PartialType(SuccessResponseDTO) {
	@ApiProperty()
	@IsNotEmpty()
	documents: DocumentDTO[]
}
