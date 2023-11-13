/* eslint-disable prettier/prettier */
import { create } from 'domain'
import { StepEntity } from 'src/modules/step/database/entities/step.entity'
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'

@Entity({ name: 'workflow' })

export class WorkflowEntity {

    constructor(props: any) {
		if (props) {
			Object.assign(this, props)
		}
	}

    @PrimaryGeneratedColumn()
    id:number

    @Column({name:'workflow_name'})
    name:string

    @Column({name: 'workflow_desc',nullable:true})
    description: string

    @OneToMany(()=> StepEntity,step =>step.workflow,{onDelete:'CASCADE'})
    steps:StepEntity[]

    @CreateDateColumn({name:'create_at',type:'timestamptz'})
	createdAt: Date
    
    @UpdateDateColumn({name:'update_at',type:'timestamptz'})
    updatedAt: Date

}

