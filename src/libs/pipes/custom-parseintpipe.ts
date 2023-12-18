import {
	Injectable,
	ParseIntPipe,
	ArgumentMetadata,
	BadRequestException,
} from '@nestjs/common'

@Injectable()
export class CustomParseIntPipe extends ParseIntPipe {
	async transform(value: any, metadata: ArgumentMetadata): Promise<number> {
		try {
			return await super.transform(value, metadata)
		} catch (error) {
			throw new BadRequestException(
				`Invalid ${metadata.data} type, expected a ${metadata.metatype.name} type`,
			)
		}
	}
}
