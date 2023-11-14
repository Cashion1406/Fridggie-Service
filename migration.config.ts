import * as dotenv from 'dotenv'
import { DataSource } from 'typeorm'

dotenv.config()

export const postgresDataSource = new DataSource({
	type: 'postgres',
	url: process.env.DATABASE_CONNECTION_STRING,
	entities: [`${__dirname}/src/**/*.entity{.ts,.js}`],
	migrations: [`${__dirname}/migrations/*{.ts,.js}`],
	entityPrefix: 'workflow_', // put your table's name prefix here,
	logging: true,
	migrationsTableName: 'workflow_migrations',
})
