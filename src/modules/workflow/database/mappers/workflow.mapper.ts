import { StepMapper } from 'src/modules/step/database/mapper/step.mapper'
import { Workflow } from '../../domain/workflow'
import { WorkflowEntity } from '../entities/workflow.entity'

export class WorkflowMapper {
	// convert workflow entity to workflow domain
	private readonly stepMapper: StepMapper
	constructor() {
		this.stepMapper = new StepMapper()
	}
	toDomain(workflowEntity: WorkflowEntity) {
		return new Workflow({
			id: workflowEntity.id,
			name: workflowEntity.name,
			description: workflowEntity.description,
			icon: workflowEntity.icon,
			steps: workflowEntity.steps?.map((step) =>
				this.stepMapper.toDomain(step),
			),
		})
	}

	// convert workflow domain to workflow entity

	toOrm(workflow: Workflow) {
		return new WorkflowEntity(workflow.serialize())
	}
}
