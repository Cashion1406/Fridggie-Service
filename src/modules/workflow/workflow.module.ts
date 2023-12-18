/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkflowMapper } from './database/mappers/workflow.mapper';
import { WorkflowController } from './controller';
import { WorkflowEntity, WorkflowRepository } from './database';
import { IconEntity, IconRepository } from '../icon/database';
import { StepMapper } from '../step/database/mapper/step.mapper';
import { StepRepository } from '../step/database/step.repository';
import { StepEntity } from '../step/database/entities/step.entity';
import { UserEntity } from '../user/database/entities/user.entity';
import { UserMapper } from '../user/database/mappers/user.mapper';
import { DocumentMapper } from '../step/database/mapper/document.mapper';
import { DocumentEntity } from '../step/database/entities/document.entity';
import { UserRepository } from '../user/database/user.repository';

@Module({
	imports:[TypeOrmModule.forFeature([WorkflowEntity, IconEntity,StepEntity,UserEntity, DocumentEntity])],
	controllers: [WorkflowController],
	providers: [WorkflowRepository,WorkflowMapper,IconRepository,UserRepository, StepMapper, StepRepository,UserMapper,DocumentMapper],

})
export class WorkflowModule {}
