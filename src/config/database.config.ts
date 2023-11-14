import { TypeOrmModuleOptions } from '@nestjs/typeorm'
import { DATABASE_CONFIG } from './constants'

export default () => ({
	[DATABASE_CONFIG]: {
		type: 'postgres',
		url: process.env.DATABASE_CONNECTION_STRING,
		autoLoadEntities: false,
		entityPrefix: 'workflow_', // put your table's name prefix here,
		logging: true,
		synchronize: false,
	} as TypeOrmModuleOptions,
})
