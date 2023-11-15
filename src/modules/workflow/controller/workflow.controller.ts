/* eslint-disable prettier/prettier */
import { Body, ClassSerializerInterceptor, Controller, Delete, Get, HttpCode, Param, Patch, Post, UseInterceptors } from '@nestjs/common'
import { WorkflowRepository } from '../database/workflow.repository';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { ProductMapper } from 'src/modules/product/database/mappers/product.mapper';
import { WorkflowMapper } from '../database/mappers/workflow.mapper';
import { WorkflowDto } from './dtos/workflow.dtos';
import { CreateWorkflowRequestDTO, CreateWorkflowResponseDTO } from './dtos/create-workflow.dtos';
import { Workflow } from '../domain/workflow';
import { WorkflowNotFoundException } from '../exceptions/workflow.exceptions';
import { UpdateWorkflowRequestDTO, UpdateWorkflowResponseDTO } from './dtos/update-workflow.dts';
import { DeleteWorkflowResponseDTO } from './dtos/delete-workflow.dtos';
import { SuccessResponseDTO } from '@libs';
import { ResultCode } from 'src/libs/enums/result-code.enum';
import { IconRepository } from 'src/modules/icon/database/icon.repository';




@Controller()
@ApiTags('Workflow')
@UseInterceptors(ClassSerializerInterceptor)
export class WorkflowController {

	constructor(
		private readonly workflowRepo: WorkflowRepository,
		private readonly iconRepo:IconRepository) {}

    @Get('/workflows')
	@ApiResponse({
		status: 200,
		type: WorkflowDto,
	})
    async getAllFlow(): Promise<WorkflowDto[]>{
        return this.workflowRepo.getAllWorkflow()
    }

	@Get('/workflow/:id')
	@ApiResponse({
		status: 200,
		type: WorkflowDto,
	})
	async getFlowById(@Param('id') id: number): Promise<WorkflowDto> {
		const workflow = await this.workflowRepo.queryById(id)

		if (!workflow) {
			throw new WorkflowNotFoundException
		}

		return new WorkflowDto(workflow)
	}


    @Post('/workflow')
    @HttpCode(201)
	@ApiResponse({
		status: 201,
		type: CreateWorkflowResponseDTO,
	})
    async createWorkflow(@Body() workflowdto: CreateWorkflowRequestDTO
	):Promise<CreateWorkflowResponseDTO>{

		const icon = workflowdto.icon_id ? await this.iconRepo.getIcon(workflowdto.icon_id) : null;

		const workflow = Workflow.createNewFlow(workflowdto, icon);

		await this.workflowRepo.save(workflow);
		return {
				workflow: workflow.serialize(),
		}
			
	}


	@Patch('/workflow/:id')
	@ApiResponse({
		status:200,
		type:WorkflowDto
	})
	async updateWorkflow(
		@Param('id') id:number, 
		@Body() dto:UpdateWorkflowRequestDTO
		):Promise<UpdateWorkflowResponseDTO>{

		const existingWorkflow = await this.workflowRepo.getFlowById(id)
		
		if (!existingWorkflow){
			 throw  new WorkflowNotFoundException()
		}

		const icon =  await this.iconRepo.getIcon(dto.icon_id)
		//if user provide new icon_id, update with new icon, else ignore update icon
		if(dto.icon_id) {
			existingWorkflow.update(dto,icon)
		}
		
		await this.workflowRepo.save(existingWorkflow)
		
		return {workflow: existingWorkflow.serialize()}
	}

	@Delete('/workflow/:id')
	@ApiResponse({
		status: 200,
		type: DeleteWorkflowResponseDTO,
	})
	async delete(@Param('id') id: number): Promise<SuccessResponseDTO> {
		const deleteSuccess = await this.workflowRepo.delete(id)

		if (!deleteSuccess) {
			throw new WorkflowNotFoundException()
		}

		return {
			resultCode: ResultCode.Success,
		}
	}
}

