import { ApiProperty } from '@nestjs/swagger'

export class DeleteStepResponseDTO {
	@ApiProperty()
	resultCode: string
}
