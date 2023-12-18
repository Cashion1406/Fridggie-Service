import { BaseException } from '@libs'

export class UserNotFoundException extends BaseException {
	public code = 'USER_NOT_FOUND'
	constructor() {
		super('No such User')
	}
}
export class UserAlreadyAssignedException extends BaseException {
	public code = 'USER_ALREADY_ASSIGNED'
	constructor() {
		super('User already assigned to different steps in the workflow')
	}
}
