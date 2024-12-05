import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateEmployeeName1733317977555 implements MigrationInterface {
    name = 'UpdateEmployeeName1733317977555'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "employee" DROP COLUMN "firstName"`);
        await queryRunner.query(`ALTER TABLE "employee" DROP COLUMN "lastName"`);
        await queryRunner.query(`ALTER TABLE "employee" ADD "name" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "employee" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "employee" ADD "lastName" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "employee" ADD "firstName" character varying NOT NULL`);
    }

}
