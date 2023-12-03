import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'

@Entity({ name: 'user_tbl' })
export class UserEntity {
	@PrimaryGeneratedColumn()
	id: number

	@Column({ name: 'user_name' })
	name: string

	constructor(props: any) {
		if (props) {
			Object.assign(this, props)
		}
	}
}
