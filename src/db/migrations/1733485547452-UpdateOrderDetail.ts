import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateOrderDetail1733485547452 implements MigrationInterface {
    name = 'UpdateOrderDetail1733485547452'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order_detail" RENAME COLUMN "inventoryId" TO "menuItemId"`);
        await queryRunner.query(`UPDATE menu_items SET "price" = 0 WHERE "price" IS NULL`);
        await queryRunner.query(`ALTER TABLE "menu_items" ALTER COLUMN "price" SET NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "menu_items" ALTER COLUMN "price" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "order_detail" RENAME COLUMN "menuItemId" TO "inventoryId"`);
    }

}
