import * as dotenv from 'dotenv'
import { DataSource } from 'typeorm'

dotenv.config()

export const postgresDataSource = new DataSource({
	type: 'postgres',
	url: process.env.DATABASE_CONNECTION_STRING,
	entities: ['../src/**/entities/*.entity.ts'],
	migrations: ['migrations/*.ts'],
	entityPrefix: 'workflow_', // put your table's name prefix here,
	logging: true,
	migrationsTableName: 'workflow_migrations',
})
