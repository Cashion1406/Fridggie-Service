import { StepEntity } from '../database/entities/step.entity'
import { DocumentType } from '../enums/document-type.enum'
import { Step } from './step'

export interface DocumentProps {
	id: number
	name: string
	step?: Step
	type: DocumentType
	url?: string
}

export class Document {
	private id: number
	private name: string
	private url: string
	private step?: Step
	private type: DocumentType

	constructor(props: DocumentProps) {
		Object.assign(this, props)
	}

	// update(dto: UpdateStepRequestDTO, owner?: UserEntity) {
	// 	;(this.name = dto.name),
	// 		(this.description = dto.description),
	// 		(this.owner = owner)
	// }

	/**
	 * Get a plain object of the domain entity without directly accessing to it. Useful when you want to convert it to JSON
	 * @returns {Record<string, any>}
	 */
	serialize() {
		return {
			id: this.id,
			name: this.name,
			type: this.type,
			url: this.url,
			step: this.step?.serialize(),
		}
	}

	static createNewDocuments(name: string, type: DocumentType, step?: Step) {
		return new Document({
			id: null,
			name,
			type,
			step,
		})
	}
}
