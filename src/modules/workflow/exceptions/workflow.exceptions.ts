import { BaseException } from '@libs'

export class WorkflowNotFoundException extends BaseException {
	public code = 'WORKFLOW_NOT_FOUND'
	constructor() {
		super('Non-existed workflow')
	}
}

export class WorkflowExistsException extends BaseException {
	public code = 'WORKFLOW_ALREADY_EXISTS'

	constructor() {
		super('Duplicated Workflow')
	}
}
