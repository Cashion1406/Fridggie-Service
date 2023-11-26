import { BaseException } from '@libs'

export class StepNotFoundException extends BaseException {
	public code = 'STEP_NOT_FOUND'

	constructor() {
		super('Non-existed Step')
	}
}

export class StepExistsException extends BaseException {
	public code = 'STEP_ALREADY_EXISTS'

	constructor() {
		super('Duplicated Step')
	}
}
