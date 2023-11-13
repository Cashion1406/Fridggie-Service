/* eslint-disable prettier/prettier */
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { WorkflowEntity } from "./entities/workflow.entity";
import { Repository } from "typeorm";
import { IQueryableWorkflowRepository } from "./workflow.interface";
import { WorkflowDto } from "../controller/dtos/workflow.dtos";
import { WorkflowMapper } from "./mappers/workflow.mapper";
import { Workflow } from "../domain/workflow";

@Injectable()
export class WorkflowRepository implements IQueryableWorkflowRepository {
    constructor(
		@InjectRepository(WorkflowEntity)
		private readonly workflowRepo: Repository<WorkflowEntity>,
        private readonly mapper: WorkflowMapper
	) {}

    queryById(id: number): Promise<WorkflowEntity> {
        return this.workflowRepo.findOne({
			where:{
				id
			},
			relations:['steps']
		})
    }

	  
    async getAllWorkflow(): Promise<WorkflowDto[]> {
        const workflows= await this.workflowRepo.find()
        return workflows.map(data=> new WorkflowDto(data))
    }

    async getFlowById(id: number) {
		const entity = await this.workflowRepo.findOne({
			where: {
				id,
			},
		})

		return entity ? this.mapper.toDomain(entity) : null
	}
    

    async save (workflow:Workflow):Promise<Workflow>{
        const entity = this.mapper.toOrm(workflow)	
		const result = await this.workflowRepo.save(entity)

		return this.mapper.toDomain(result)

    }
  
    

    async delete(id: number): Promise<boolean> {
		const result = await this.workflowRepo.delete(id)
		return result.affected > 0 ? true : false
	}
    
}
