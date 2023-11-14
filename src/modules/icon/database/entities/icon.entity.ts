import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'

@Entity({ name: 'icon' })
export class IconEntity {
	@PrimaryGeneratedColumn()
	id: number

	@Column()
	NamePath: string
}
