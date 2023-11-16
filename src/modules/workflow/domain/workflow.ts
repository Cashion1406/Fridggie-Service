/* eslint-disable prettier/prettier */

import { UpdateWorkflowRequestDTO } from "../controller/dtos/update-workflow.dts"
import { CreateWorkflowRequestDTO } from "../controller/dtos/create-workflow.dtos"
import { IconEntity } from "src/modules/icon/database"


export interface WorkflowProps{
    id:number
    name:string
	description:string
	icon?:IconEntity
}

export class Workflow {
    private id: number
	private name: string
	private description:string
	private icon?:IconEntity


    constructor(props: WorkflowProps) {
		Object.assign(this, props)
	}

	update(dto: UpdateWorkflowRequestDTO,icon?:IconEntity) {
		this.name = dto.name,
		this.description=dto.description
		this.icon=icon
		
	}

	/**
	 * Get a plain object of the domain entity without directly accessing to it. Useful when you want to convert it to JSON
	 * @returns {Record<string, any>}
	 */
	serialize() {
		return {
			id: this.id,
			name: this.name,
			description: this.description,
			icon: this.icon
		}
	}

	static createNewFlow(dto:CreateWorkflowRequestDTO, icon?:IconEntity) {
		return new Workflow({
			id: null,
			name :dto.name,
			description :dto.description,
			icon
		})
	}
}
