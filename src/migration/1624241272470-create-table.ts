import {MigrationInterface, QueryRunner} from "typeorm";

export class createTable1624241272470 implements MigrationInterface {

	public async up(queryRunner: QueryRunner): Promise<void> {
		// await queryRunner.query(`CREATE DATABASE IF NOT EXISTS 'database';`);
		await queryRunner.query(`CREATE TABLE IF NOT EXISTS 'MOVIES' (
			'id' INTEGER PRIMARY KEY AUTOINCREMENT,
			'year' INTEGER NOT NULL,
			'title' VARCHAR(255) NOT NULL,
			'producers' VARCHAR(255) NOT NULL,
			'winner' BOOLEAN
		);`);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.dropTable(`MOVIES`);
	}
}
