import { TypeOrmModuleOptions } from '@nestjs/typeorm'
import { DATABASE_CONFIG } from './constants'

export default () => ({
	[DATABASE_CONFIG]: {
		type: 'postgres',
		url: process.env.DATABASE_CONNECTION_STRING,
		autoLoadEntities: true,
		entityPrefix: 'workflow_', // put your table's name prefix here,
		logging: true,
	} as TypeOrmModuleOptions,
})
