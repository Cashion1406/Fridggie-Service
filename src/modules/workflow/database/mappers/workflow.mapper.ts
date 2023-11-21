/* eslint-disable prettier/prettier */
import { Workflow } from "../../domain/workflow"
import { WorkflowEntity } from "../entities/workflow.entity"

export class WorkflowMapper {

	toDomain(workflowEntity: WorkflowEntity) {

		return new Workflow({

			id: workflowEntity.id,
			name: workflowEntity.name,
			description:workflowEntity.description,
			icon:workflowEntity.icon
		})

	}

	toOrm(workflow: Workflow) {

		return new WorkflowEntity(workflow.serialize())

	}

}

