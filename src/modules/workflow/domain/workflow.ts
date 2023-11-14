/* eslint-disable prettier/prettier */

import { UpdateWorkflowRequestDTO } from "../controller/dtos/update-workflow.dts"
import { CreateWorkflowRequestDTO } from "../controller/dtos/create-workflow.dtos"

export interface WorkflowProps{
    id:number
    name:string
	description:string
}

export class Workflow {
    private id: number
	private name: string
	private description:string


    constructor(props: WorkflowProps) {
		Object.assign(this, props)
	}

	update(dto: UpdateWorkflowRequestDTO) {
		this.name = dto.name,
		this.description=dto.description
	}

	/**
	 * Get a plain object of the domain entity without directly accessing to it. Useful when you want to convert it to JSON
	 * @returns {Record<string, any>}
	 */
	serialize() {
		return {
			id: this.id,
			name: this.name,
			description: this.description
		}
	}

	static createNewFlow(dto:CreateWorkflowRequestDTO) {
		return new Workflow({
			id: null,
			name :dto.name,
			description :dto.description
		})
	}
}
