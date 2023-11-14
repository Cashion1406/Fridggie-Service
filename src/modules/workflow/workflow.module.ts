/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { WorkflowController } from './controller/workflow.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkflowEntity } from './database/entities/workflow.entity';
import { WorkflowRepository } from './database/workflow.repository';
import { WorkflowMapper } from './database/mappers/workflow.mapper';

@Module({
	imports:[TypeOrmModule.forFeature([WorkflowEntity])],
	controllers: [WorkflowController],
	providers: [WorkflowRepository,WorkflowMapper],

})
export class WorkflowModule {}
