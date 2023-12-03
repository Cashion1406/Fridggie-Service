/* eslint-disable prettier/prettier */
import { UserEntity } from 'src/modules/user/database/entities/user.entity'
import { WorkflowEntity } from 'src/modules/workflow/database/entities/workflow.entity'
import { UpdateStepRequestDTO } from '../controller/dtos/update-step.dtos'
import { Workflow } from 'src/modules/workflow/domain'

export interface StepProps {
	id: number
	name: string
	description: string
	owner?: UserEntity
	order: number
	workflow?: Workflow
}

export class Step {
	private id: number
	private name: string
	private description: string
	private owner?: UserEntity
	private order: number
	private workflow?: Workflow

	constructor(props: StepProps) {
		Object.assign(this, props)
	}

	update(dto: UpdateStepRequestDTO, owner?: UserEntity) {
		this.name = dto.name,
		this.description = dto.description,
		this.owner = owner
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
				owner: this.owner,
				workflow: this.workflow,
				order: this.order,
			}
		}

	static createNewStep(
		name: string,
		description: string,
		owner: UserEntity,
		workflow: Workflow,
	) {
		return new Step({
			id: null,
			name,
			description,
			order: null,
			owner,
			workflow,
		})
	}
}
