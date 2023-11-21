import { UserEntity } from "src/modules/user/database/entities/user.entity";
import { WorkflowEntity } from "src/modules/workflow/database/entities/workflow.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToMany, ManyToOne, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({name:'step_tbl'})
export class StepEntity {

    constructor(props: any) {
		if (props) {
			Object.assign(this, props)
		}
	}

    @PrimaryGeneratedColumn()
    id:number

    @Column({name:'step_name',unique:true})
    name:string
    
    @Column({name:"step_description"})
    description: string

    @Column({name:"step_order"})
    order:number

    @CreateDateColumn({name:'create_at',type:'timestamptz'})
    createAt: Date

    @UpdateDateColumn({name:'update_at',type:'timestamptz'})
    updateAt: Date

    @ManyToOne(()=> UserEntity)
    @JoinColumn({name:'user_id'})
    owner:UserEntity

    @ManyToOne(()=>WorkflowEntity, workflow=>workflow.steps,{onDelete:'CASCADE'})
    @JoinColumn({name:'workflow_id'})
    workflow:WorkflowEntity

}
