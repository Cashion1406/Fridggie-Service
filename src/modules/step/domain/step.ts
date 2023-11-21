/* eslint-disable prettier/prettier */

import { UserEntity } from "src/modules/user/database/entities/user.entity"
import { WorkflowEntity } from "src/modules/workflow/database/entities/workflow.entity"

export interface StepProps{
    id:number
    name:string
	description:string
	owner:UserEntity
	workflow:WorkflowEntity
}


export class Step {

    private id: number
	private name: string
	private description:string
	private owner:UserEntity
	private workflow:WorkflowEntity

    constructor(props: StepProps) {
		Object.assign(this, props)
	}


	/**
	 * Get a plain object of the domain entity without directly accessing to it. Useful when you want to convert it to JSON
	 * @returns {Record<string, any>}
	 */
	serialize() {
		return {
			id: this.id,
			name: this.name,
			description:this.description,
			owner:this.owner,
			workflow:this.workflow
        
		}
	}

	static createNewStep(name: string, description:string,owner:UserEntity,workflow:WorkflowEntity) {
		return new Step({
			id: null,
			name,
			description,
			owner,
			workflow
		})
	}
}

