import { StepEntity } from '../entities/step.entity'
import { Step } from '../../domain/step'
import { DocumentMapper } from './document.mapper'

export class StepMapper {
	// convert step entity to steps domain
	private readonly documentMapper: DocumentMapper
	constructor() {
		this.documentMapper = new DocumentMapper()
	}
	toDomain(step: StepEntity) {
		return new Step({
			id: step.id,
			name: step.name,
			description: step.description,
			owner: step.owner,
			documents: step?.documents?.map((documentEntity) =>
				this.documentMapper.toDomain(documentEntity),
			),
		})
	}

	// convert step domain to step entity
	toOrm(step: Step) {
		return new StepEntity(step.serialize())
	}
}
