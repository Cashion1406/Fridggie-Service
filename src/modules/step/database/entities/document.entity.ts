/* eslint-disable prettier/prettier */
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm"
import { StepEntity } from "./step.entity"
import { DocumentType } from "../../enums/document-type.enum"

@Entity({ name: 'document' })
export class DocumentEntity {
	constructor(props: any) {
		if (props) {
			Object.assign(this, props)
		}
	}

	@PrimaryGeneratedColumn()
	id: number

	@Column({ name: 'document_name'})
	name: string

	@Column({ name: 'document_url',nullable:true })
	url: string

	@Column({name:'document_type'})
	type:DocumentType

	@ManyToOne(()=>StepEntity, (step)=>step.documents,{onDelete:'CASCADE'})
	@JoinColumn({name:'step_id'})
	step: StepEntity

	@CreateDateColumn({ name: 'create_at', type: 'timestamptz' })
	createdAt: Date

	@UpdateDateColumn({ name: 'update_at', type: 'timestamptz' })
	updatedAt: Date
}
