import { ApiProperty } from '@nestjs/swagger'

export class DeleteWorkflowResponseDTO {
	@ApiProperty()
	resultCode: string
}
