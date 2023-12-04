/* eslint-disable prettier/prettier */
import { BaseException } from "@libs";

export class UserNotFoundException extends BaseException {
	public code= 'USER_NOT_FOUND'
    constructor() {
		super('No such User')
	}
}

