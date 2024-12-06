import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeQuantityToInStock1733477225435 implements MigrationInterface {
    name = 'ChangeQuantityToInStock1733477225435'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "inventory" RENAME COLUMN "quantity" TO "in_stock"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "inventory" RENAME COLUMN "in_stock" TO "quantity"`);
    }

}
