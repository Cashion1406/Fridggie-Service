/* eslint-disable prettier/prettier */

import { Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { StepEntity } from "./entities/step.entity";
import { Repository } from "typeorm";
import { StepDTO } from "../controller/dtos/step.dtos";
import { WorkflowEntity } from "src/modules/workflow/database/entities/workflow.entity";
import { StepMapper } from "./mapper/step.mapper";
import { Step } from "../domain/step";
import { WorkflowRepository } from "src/modules/workflow/database/workflow.repository";


@Injectable()
export class StepRepository {
    constructor(
		@InjectRepository(StepEntity)
		private readonly stepRepo: Repository<StepEntity>,
		private readonly workflowRepo: WorkflowRepository,
		
		private readonly mapper:StepMapper
	) {}


	async getWorkFlow(id: number):Promise<WorkflowEntity> {
		return await this.workflowRepo.queryById(id) 
	}


	async save(step: Step): Promise<Step> {
		const entity = this.mapper.toOrm(step)
	
		const result = await this.stepRepo.save(entity)
		

		return this.mapper.toDomain(result)
	}

	async queryById(id: number): Promise<StepDTO> {
		return  this.stepRepo.findOne({
			where: {
				id,
			},
			relations:['owner']
		})
	}
	async getAllStepFromWorkflow(id:number):Promise<StepDTO[]>{


        const steps = await this.stepRepo.find({
			where: {
				workflow:{
					id:id
				}
			},
			relations:['owner']
		})
		return steps.map(data=> new StepDTO(data))
	}
}
