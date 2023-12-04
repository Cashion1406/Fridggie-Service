/* eslint-disable prettier/prettier */

import { WorkflowEntity } from './entities/workflow.entity'


export interface IQueryableWorkflowRepository {

    queryById(id:number): Promise<WorkflowEntity>

}

