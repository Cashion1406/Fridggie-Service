import * as dotenv from 'dotenv'
import { DataSource } from 'typeorm'

dotenv.config()

export const postgresDataSource = new DataSource({
	type: 'postgres',
	url: process.env.DATABASE_CONNECTION_STRING,
	entities: ['src/**/entities/*.ts'],
	entityPrefix: 'workflow_', // put your table's name prefix here,
	logging: true,
	migrations: ['migrations/*.ts'],
	migrationsTableName: 'workflow_migrations',
})
