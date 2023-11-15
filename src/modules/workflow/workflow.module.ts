/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { WorkflowController } from './controller/workflow.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkflowEntity } from './database/entities/workflow.entity';
import { WorkflowRepository } from './database/workflow.repository';
import { WorkflowMapper } from './database/mappers/workflow.mapper';
import { IconRepository } from '../icon/database/icon.repository';
import { IconEntity } from '../icon/database/entities/icon.entity';

@Module({
	imports:[TypeOrmModule.forFeature([WorkflowEntity, IconEntity])],
	controllers: [WorkflowController],
	providers: [WorkflowRepository,WorkflowMapper,IconRepository],

})
export class WorkflowModule {}
