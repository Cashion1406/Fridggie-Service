/* eslint-disable prettier/prettier */
import { StepEntity } from "src/modules/step/database/entities/step.entity"
import { Workflow } from "../../domain/workflow"
import { WorkflowEntity } from "../entities/workflow.entity"

export class WorkflowMapper {

	toDomain(workflowEntity: WorkflowEntity) {

		return new Workflow({

			id: workflowEntity.id,
			name: workflowEntity.name,
			description:workflowEntity.description
		})

	}

	toOrm(workflow: Workflow) {

		return new WorkflowEntity(workflow.serialize())

	}

}

