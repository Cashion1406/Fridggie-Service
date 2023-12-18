import { Step } from 'src/modules/step/domain/step'
import { UpdateWorkflowRequestDTO } from '../controller/dtos/update-workflow.dts'
import { IconEntity } from 'src/modules/icon/database'

export interface WorkflowProps {
	id: number
	name: string
	description: string
	icon: IconEntity
	steps?: Step[]
}

export class Workflow {
	private id: number
	private name: string
	private description: string
	private icon: IconEntity
	private steps?: Step[]

	constructor(props: WorkflowProps) {
		Object.assign(this, props)
	}

	update(dto: UpdateWorkflowRequestDTO, icon?: IconEntity) {
		;(this.name = dto.name), (this.description = dto.description)
		this.icon = icon
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
			icon: this.icon,
			steps: this.steps?.map((step) => step.serialize()),
		}
	}

	static createNewFlow(
		name: string,
		description: string,
		icon?: IconEntity,
		steps?: Step[],
	) {
		return new Workflow({
			id: null,
			name: name,
			description: description,
			icon,
			steps: steps,
		})
	}
}
