/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkflowMapper } from './database/mappers/workflow.mapper';
import { WorkflowController } from './controller';
import { WorkflowEntity, WorkflowRepository } from './database';
import { IconEntity, IconRepository } from '../icon/database';

@Module({
	imports:[TypeOrmModule.forFeature([WorkflowEntity, IconEntity])],
	controllers: [WorkflowController],
	providers: [WorkflowRepository,WorkflowMapper,IconRepository],

})
export class WorkflowModule {}
