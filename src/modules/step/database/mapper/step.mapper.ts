/* eslint-disable prettier/prettier */
import { ProductEntity } from "src/modules/product/database"
import { Product } from "src/modules/product/domain"
import { StepEntity } from "../entities/step.entity"
import { Step } from "../../domain/step"

export class StepMapper {

    // convert step entity to product domain
    toDomain(step: StepEntity) {
		return new Step({
			id: step.id,
			name: step.name,
			description: step.description,
			owner:step.owner,
			workflow:step.workflow
		})
	}

    // convert step domain to step entity
	toOrm(step: Step) {
		return new StepEntity(step.serialize())
	}
}
