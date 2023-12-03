/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StepEntity } from './database/entities/step.entity';
import { StepController } from './controller/step.controller';
import { StepRepository } from './database/step.repository';
import { WorkflowEntity } from '../workflow/database/entities/workflow.entity';
import { WorkflowRepository } from '../workflow/database/workflow.repository';
import { WorkflowController } from '../workflow/controller/workflow.controller';
import { WorkflowMapper } from '../workflow/database/mappers/workflow.mapper';
import { StepMapper } from './database/mapper/step.mapper';
import { UserRepository } from '../user/database/user.repository';
import { UserEntity } from '../user/database/entities/user.entity';
import { UserMapper } from '../user/database/mappers/user.mapper';

@Module({
    imports:[TypeOrmModule.forFeature([StepEntity, WorkflowEntity, UserEntity])],
    controllers:[StepController],
    providers:[StepRepository,WorkflowRepository,UserRepository, WorkflowMapper, StepMapper,UserMapper]
})
export class StepModule {}
