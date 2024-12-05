import { MigrationInterface, QueryRunner } from "typeorm";

export class AddEmployeeDefaultRole1733391231173 implements MigrationInterface {
    name = 'AddEmployeeDefaultRole1733391231173'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "employee" ALTER COLUMN "role" SET DEFAULT 'employee'`);
        await queryRunner.query(`ALTER TABLE "employee" ALTER COLUMN "phone" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "employee" ALTER COLUMN "phone" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "employee" ALTER COLUMN "role" DROP DEFAULT`);
    }

}
