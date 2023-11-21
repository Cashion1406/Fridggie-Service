/* eslint-disable prettier/prettier */
import { ClassSerializerInterceptor, Controller, UseInterceptors,Get,Param,Post, Body } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { StepRepository } from '../database/step.repository';
import { StepDTO } from './dtos/step.dtos';
import { WorkflowRepository } from 'src/modules/workflow/database/workflow.repository';
import { WorkflowNotFoundException } from 'src/modules/workflow/exceptions/workflow.exceptions';
import { StepNotFoundExceptions } from '../exception/step.exceptions';
import { CreateStepRequestDTO, CreateStepResponseDTO } from './dtos/create-step.dtos';
import { Step } from '../domain/step';
import { UserRepository } from 'src/modules/user/database/user.repository';
import { UserNotFoundException } from 'src/modules/user/exception/user.exceptions';

@Controller('/step')
@ApiTags('Steps')
@UseInterceptors(ClassSerializerInterceptor)
export class StepController {
    constructor(
        private readonly stepRepo:StepRepository,
        private readonly userRepo:UserRepository,
		private readonly workflowRepo: WorkflowRepository,

        ){}

    @Get('/workflow/:id')
    @ApiResponse({
		status: 200,
		type: StepDTO,
	})
    async getStepsFromWorkflow(@Param('id') id:number):Promise<StepDTO[]>{

        const workflow = await this.stepRepo.getWorkFlow(id)

        if(!workflow){
            throw new WorkflowNotFoundException
        }

        return this.stepRepo.getAllStepFromWorkflow(id)
        
    }


    @Get('/:id')
    @ApiResponse({
		status: 200,
		type: StepDTO,
	})
    async getStepById(@Param('id') id:number):Promise<StepDTO>{

        const step =  await this.stepRepo.queryById(id)

		if (!step) {
			throw new StepNotFoundExceptions
		}

		return new StepDTO(step)
        
    }

    

    @Post('/workflow/:id')
    @ApiResponse({
		status: 200,
		type: CreateStepRequestDTO,
	})
    async createSteps(@Param('id') id:number, @Body() dto:CreateStepRequestDTO):Promise<CreateStepResponseDTO>{

        const owner = await this.userRepo.getUserById(dto.user_id) 
        if (!owner) throw new UserNotFoundException

        const workflow = await this.workflowRepo.queryById(id)
        if (!workflow) throw new WorkflowNotFoundException

        
        const step = Step.createNewStep(dto.name,dto.description,owner,workflow)
        
        await this.stepRepo.save(step)
        return {
           step: step.serialize() 
        }
        
    }
}
