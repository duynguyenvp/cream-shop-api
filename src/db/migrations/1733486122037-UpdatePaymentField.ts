import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdatePaymentField1733486122037 implements MigrationInterface {
    name = 'UpdatePaymentField1733486122037'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order" ALTER COLUMN "paymentId" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order" ALTER COLUMN "paymentId" SET NOT NULL`);
    }

}
