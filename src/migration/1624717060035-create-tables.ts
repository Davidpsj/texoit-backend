import {MigrationInterface, QueryRunner} from "typeorm";

export class createTables1624717060035 implements MigrationInterface {
    name = 'createTables1624717060035'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "producers" ("name" varchar PRIMARY KEY NOT NULL)`);
        await queryRunner.query(`CREATE TABLE "prizes" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "year" integer NOT NULL)`);
        await queryRunner.query(`CREATE TABLE "movies" ("title" varchar PRIMARY KEY NOT NULL, "studios" varchar NOT NULL, "prizesId" integer)`);
        await queryRunner.query(`CREATE TABLE "movies_producers_producers" ("moviesTitle" varchar NOT NULL, "producersName" varchar NOT NULL, PRIMARY KEY ("moviesTitle", "producersName"))`);
        await queryRunner.query(`CREATE INDEX "IDX_d0ac4b0245d326ce2c5d4ad369" ON "movies_producers_producers" ("moviesTitle") `);
        await queryRunner.query(`CREATE INDEX "IDX_5d8f78f4063c0d6d8b6836efbe" ON "movies_producers_producers" ("producersName") `);
        await queryRunner.query(`CREATE TABLE "temporary_movies" ("title" varchar PRIMARY KEY NOT NULL, "studios" varchar NOT NULL, "prizesId" integer, CONSTRAINT "FK_2e946c36e017b666185b68395b9" FOREIGN KEY ("prizesId") REFERENCES "prizes" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_movies"("title", "studios", "prizesId") SELECT "title", "studios", "prizesId" FROM "movies"`);
        await queryRunner.query(`DROP TABLE "movies"`);
        await queryRunner.query(`ALTER TABLE "temporary_movies" RENAME TO "movies"`);
        await queryRunner.query(`DROP INDEX "IDX_d0ac4b0245d326ce2c5d4ad369"`);
        await queryRunner.query(`DROP INDEX "IDX_5d8f78f4063c0d6d8b6836efbe"`);
        await queryRunner.query(`CREATE TABLE "temporary_movies_producers_producers" ("moviesTitle" varchar NOT NULL, "producersName" varchar NOT NULL, CONSTRAINT "FK_d0ac4b0245d326ce2c5d4ad3699" FOREIGN KEY ("moviesTitle") REFERENCES "movies" ("title") ON DELETE CASCADE ON UPDATE CASCADE, CONSTRAINT "FK_5d8f78f4063c0d6d8b6836efbe9" FOREIGN KEY ("producersName") REFERENCES "producers" ("name") ON DELETE CASCADE ON UPDATE CASCADE, PRIMARY KEY ("moviesTitle", "producersName"))`);
        await queryRunner.query(`INSERT INTO "temporary_movies_producers_producers"("moviesTitle", "producersName") SELECT "moviesTitle", "producersName" FROM "movies_producers_producers"`);
        await queryRunner.query(`DROP TABLE "movies_producers_producers"`);
        await queryRunner.query(`ALTER TABLE "temporary_movies_producers_producers" RENAME TO "movies_producers_producers"`);
        await queryRunner.query(`CREATE INDEX "IDX_d0ac4b0245d326ce2c5d4ad369" ON "movies_producers_producers" ("moviesTitle") `);
        await queryRunner.query(`CREATE INDEX "IDX_5d8f78f4063c0d6d8b6836efbe" ON "movies_producers_producers" ("producersName") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "IDX_5d8f78f4063c0d6d8b6836efbe"`);
        await queryRunner.query(`DROP INDEX "IDX_d0ac4b0245d326ce2c5d4ad369"`);
        await queryRunner.query(`ALTER TABLE "movies_producers_producers" RENAME TO "temporary_movies_producers_producers"`);
        await queryRunner.query(`CREATE TABLE "movies_producers_producers" ("moviesTitle" varchar NOT NULL, "producersName" varchar NOT NULL, PRIMARY KEY ("moviesTitle", "producersName"))`);
        await queryRunner.query(`INSERT INTO "movies_producers_producers"("moviesTitle", "producersName") SELECT "moviesTitle", "producersName" FROM "temporary_movies_producers_producers"`);
        await queryRunner.query(`DROP TABLE "temporary_movies_producers_producers"`);
        await queryRunner.query(`CREATE INDEX "IDX_5d8f78f4063c0d6d8b6836efbe" ON "movies_producers_producers" ("producersName") `);
        await queryRunner.query(`CREATE INDEX "IDX_d0ac4b0245d326ce2c5d4ad369" ON "movies_producers_producers" ("moviesTitle") `);
        await queryRunner.query(`ALTER TABLE "movies" RENAME TO "temporary_movies"`);
        await queryRunner.query(`CREATE TABLE "movies" ("title" varchar PRIMARY KEY NOT NULL, "studios" varchar NOT NULL, "prizesId" integer)`);
        await queryRunner.query(`INSERT INTO "movies"("title", "studios", "prizesId") SELECT "title", "studios", "prizesId" FROM "temporary_movies"`);
        await queryRunner.query(`DROP TABLE "temporary_movies"`);
        await queryRunner.query(`DROP INDEX "IDX_5d8f78f4063c0d6d8b6836efbe"`);
        await queryRunner.query(`DROP INDEX "IDX_d0ac4b0245d326ce2c5d4ad369"`);
        await queryRunner.query(`DROP TABLE "movies_producers_producers"`);
        await queryRunner.query(`DROP TABLE "movies"`);
        await queryRunner.query(`DROP TABLE "prizes"`);
        await queryRunner.query(`DROP TABLE "producers"`);
    }

}
