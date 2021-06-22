import {MigrationInterface, QueryRunner, TableColumn} from "typeorm";

export class studioColumnAdded1624245371740 implements MigrationInterface {

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.addColumn('MOVIES', new TableColumn({
			name: 'studios',
			type: 'string',
			isNullable: false,
		}));
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.dropColumn('MOVIES' as any, {
			name: 'studios',
		} as any);
	}
}
