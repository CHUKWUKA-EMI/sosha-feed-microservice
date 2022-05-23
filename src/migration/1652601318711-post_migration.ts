import {MigrationInterface, QueryRunner} from "typeorm";

export class postMigration1652601318711 implements MigrationInterface {
    name = 'postMigration1652601318711'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "posts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "content" text, "imgUrl" character varying, "videoUrl" character varying, "imagekit_fileId" character varying, "userId" character varying NOT NULL, "userFirstName" character varying NOT NULL, "userLastName" character varying NOT NULL, "userName" character varying NOT NULL, "userImageUrl" character varying, "numberOfLikes" integer NOT NULL DEFAULT '0', "numberOfComments" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_2829ac61eff60fcec60d7274b9e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_ae05faaa55c866130abef6e1fe" ON "posts" ("userId") `);
        await queryRunner.query(`CREATE TABLE "query-result-cache" ("id" SERIAL NOT NULL, "identifier" character varying, "time" bigint NOT NULL, "duration" integer NOT NULL, "query" text NOT NULL, "result" text NOT NULL, CONSTRAINT "PK_6a98f758d8bfd010e7e10ffd3d3" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "query-result-cache"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_ae05faaa55c866130abef6e1fe"`);
        await queryRunner.query(`DROP TABLE "posts"`);
    }

}
