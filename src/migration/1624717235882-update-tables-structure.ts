import {MigrationInterface, QueryRunner} from "typeorm";

export class updateTablesStructure1624717235882 implements MigrationInterface {
    name = 'updateTablesStructure1624717235882'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "temporary_movies" ("title" varchar PRIMARY KEY NOT NULL, "studios" varchar NOT NULL, "prizesId" integer)`);
        await queryRunner.query(`INSERT INTO "temporary_movies"("title", "studios", "prizesId") SELECT "title", "studios", "prizesId" FROM "movies"`);
        await queryRunner.query(`DROP TABLE "movies"`);
        await queryRunner.query(`ALTER TABLE "temporary_movies" RENAME TO "movies"`);
        await queryRunner.query(`CREATE TABLE "temporary_movies" ("title" varchar PRIMARY KEY NOT NULL, "studios" varchar NOT NULL, "prizesYear" integer)`);
        await queryRunner.query(`INSERT INTO "temporary_movies"("title", "studios", "prizesYear") SELECT "title", "studios", "prizesId" FROM "movies"`);
        await queryRunner.query(`DROP TABLE "movies"`);
        await queryRunner.query(`ALTER TABLE "temporary_movies" RENAME TO "movies"`);
        await queryRunner.query(`CREATE TABLE "temporary_prizes" ("year" integer NOT NULL)`);
        await queryRunner.query(`INSERT INTO "temporary_prizes"("year") SELECT "year" FROM "prizes"`);
        await queryRunner.query(`DROP TABLE "prizes"`);
        await queryRunner.query(`ALTER TABLE "temporary_prizes" RENAME TO "prizes"`);
        await queryRunner.query(`CREATE TABLE "temporary_prizes" ("year" integer PRIMARY KEY NOT NULL)`);
        await queryRunner.query(`INSERT INTO "temporary_prizes"("year") SELECT "year" FROM "prizes"`);
        await queryRunner.query(`DROP TABLE "prizes"`);
        await queryRunner.query(`ALTER TABLE "temporary_prizes" RENAME TO "prizes"`);
        await queryRunner.query(`CREATE TABLE "temporary_movies" ("title" varchar PRIMARY KEY NOT NULL, "studios" varchar NOT NULL, "prizesYear" integer, CONSTRAINT "FK_6a711f7b78b27fc269b34b0873f" FOREIGN KEY ("prizesYear") REFERENCES "prizes" ("year") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_movies"("title", "studios", "prizesYear") SELECT "title", "studios", "prizesYear" FROM "movies"`);
        await queryRunner.query(`DROP TABLE "movies"`);
        await queryRunner.query(`ALTER TABLE "temporary_movies" RENAME TO "movies"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "movies" RENAME TO "temporary_movies"`);
        await queryRunner.query(`CREATE TABLE "movies" ("title" varchar PRIMARY KEY NOT NULL, "studios" varchar NOT NULL, "prizesYear" integer)`);
        await queryRunner.query(`INSERT INTO "movies"("title", "studios", "prizesYear") SELECT "title", "studios", "prizesYear" FROM "temporary_movies"`);
        await queryRunner.query(`DROP TABLE "temporary_movies"`);
        await queryRunner.query(`ALTER TABLE "prizes" RENAME TO "temporary_prizes"`);
        await queryRunner.query(`CREATE TABLE "prizes" ("year" integer NOT NULL)`);
        await queryRunner.query(`INSERT INTO "prizes"("year") SELECT "year" FROM "temporary_prizes"`);
        await queryRunner.query(`DROP TABLE "temporary_prizes"`);
        await queryRunner.query(`ALTER TABLE "prizes" RENAME TO "temporary_prizes"`);
        await queryRunner.query(`CREATE TABLE "prizes" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "year" integer NOT NULL)`);
        await queryRunner.query(`INSERT INTO "prizes"("year") SELECT "year" FROM "temporary_prizes"`);
        await queryRunner.query(`DROP TABLE "temporary_prizes"`);
        await queryRunner.query(`ALTER TABLE "movies" RENAME TO "temporary_movies"`);
        await queryRunner.query(`CREATE TABLE "movies" ("title" varchar PRIMARY KEY NOT NULL, "studios" varchar NOT NULL, "prizesId" integer)`);
        await queryRunner.query(`INSERT INTO "movies"("title", "studios", "prizesId") SELECT "title", "studios", "prizesYear" FROM "temporary_movies"`);
        await queryRunner.query(`DROP TABLE "temporary_movies"`);
        await queryRunner.query(`ALTER TABLE "movies" RENAME TO "temporary_movies"`);
        await queryRunner.query(`CREATE TABLE "movies" ("title" varchar PRIMARY KEY NOT NULL, "studios" varchar NOT NULL, "prizesId" integer, CONSTRAINT "FK_2e946c36e017b666185b68395b9" FOREIGN KEY ("prizesId") REFERENCES "prizes" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "movies"("title", "studios", "prizesId") SELECT "title", "studios", "prizesId" FROM "temporary_movies"`);
        await queryRunner.query(`DROP TABLE "temporary_movies"`);
    }

}
