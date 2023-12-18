import { User } from '../../domain/user'
import { UserEntity } from '../entities/user.entity'

export class UserMapper {
	toDomain(userEntity: UserEntity) {
		return new User({
			id: userEntity.id,
			name: userEntity.name,
		})
	}

	toOrm(user: User) {
		return new UserEntity(user.serialize())
	}
}
