/* eslint-disable prettier/prettier */
import { BaseException } from "@libs";

export class IconNotFoundException extends BaseException {
    public code= 'ICON_NOT_FOUND'
    constructor() {
		super('Failed to load Icon')
	}
}
