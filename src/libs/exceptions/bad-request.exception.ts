import { ValidationError } from 'class-validator'
import { BaseException } from './exception.base'

export class BadRequestException extends BaseException {
	code = 'INVALID_REQUEST_DATA'

	constructor(validationErrors: ValidationError[]) {
		super(BadRequestException.extractError(validationErrors))
	}

	private static extractError(validationErrors: ValidationError[]) {
		for (const error of validationErrors) {
			//check current error constraints
			if (error.constraints) {
				//get the first error found with message from validation
				return Object.values(error.constraints)[0]
			}

			//if the error contain nested/children error, the extractError to get the first error
			if (error.children && error.children.length > 0) {
				const childErrorMessage = BadRequestException.extractError(
					error.children,
				)
				if (BadRequestException.extractError(error.children)) {
					return childErrorMessage
				}
			}
		}
	}
}
