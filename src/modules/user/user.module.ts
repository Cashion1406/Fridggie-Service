/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './database/entities/user.entity';
import { StepRepository } from '../step/database/step.repository';
import { UserRepository } from './database/user.repository';

@Module({
    imports:[TypeOrmModule.forFeature([UserEntity])],
    providers:[UserRepository]
})
export class UserModule {}
