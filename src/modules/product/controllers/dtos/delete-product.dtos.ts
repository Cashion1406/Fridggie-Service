import { ApiProperty } from '@nestjs/swagger'

export class DeleteProductResponseDTO {
	@ApiProperty()
	resultCode: string
}
