/* eslint-disable prettier/prettier */
import { BaseException } from "@libs";

export class StepNotFoundExceptions extends BaseException {
    public code: "STEP_NOT_FOUND";
    
	constructor() {
		super('Non-existed Step')
	}
}

