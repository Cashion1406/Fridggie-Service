import { MigrationInterface, QueryRunner } from 'typeorm'

export class Migration1696687527822 implements MigrationInterface {
	name = 'Migration1696687527822'

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`CREATE TABLE "workflow_products" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "price" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_7853f973c7fc5fb1776cbe4ae54" PRIMARY KEY ("id"))`,
		)
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`DROP TABLE "workflow_products"`)
	}
}
