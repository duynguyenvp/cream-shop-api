import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateMenuNullableFields1733480234671 implements MigrationInterface {
    name = 'UpdateMenuNullableFields1733480234671'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "menu_items" ALTER COLUMN "description" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "menu_items" ALTER COLUMN "price" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "menu_items" ALTER COLUMN "price" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "menu_items" ALTER COLUMN "description" SET NOT NULL`);
    }

}
