import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1733317545740 implements MigrationInterface {
    name = 'Init1733317545740'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "customer" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "email" character varying NOT NULL, "phone" character varying NOT NULL, CONSTRAINT "PK_a7a13f4cacb744524e44dfdad32" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "menu_items" ("menu_item_id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" character varying NOT NULL, "price" numeric(10,2) NOT NULL, CONSTRAINT "PK_a2db37ed8911bbdd4be781d4b0b" PRIMARY KEY ("menu_item_id"))`);
        await queryRunner.query(`CREATE TABLE "recipes" ("recipe_id" SERIAL NOT NULL, "quantity" numeric(10,2) NOT NULL, "unit" character varying NOT NULL, "menuItemMenuItemId" integer, "ingredientInventoryId" integer, CONSTRAINT "PK_df6485530f24cbcbc4c57171067" PRIMARY KEY ("recipe_id"))`);
        await queryRunner.query(`CREATE TABLE "inventory" ("inventory_id" SERIAL NOT NULL, "name" character varying NOT NULL, "price" numeric(10,2) NOT NULL, "quantity" numeric(10,2) NOT NULL, CONSTRAINT "PK_711db979ad954f0ab33e3eea53a" PRIMARY KEY ("inventory_id"))`);
        await queryRunner.query(`CREATE TABLE "order_detail" ("id" SERIAL NOT NULL, "quantity" numeric(10,2) NOT NULL, "price" numeric(10,2) NOT NULL, "orderId" integer, "inventoryInventoryId" integer, CONSTRAINT "PK_0afbab1fa98e2fb0be8e74f6b38" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "payment" ("id" SERIAL NOT NULL, "amount" integer NOT NULL, "method" character varying NOT NULL, CONSTRAINT "PK_fcaec7df5adf9cac408c686b2ab" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "order" ("id" SERIAL NOT NULL, "totalPrice" integer NOT NULL, "status" character varying NOT NULL, "customerId" integer, "employeeId" integer, CONSTRAINT "PK_1031171c13130102495201e3e20" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "employee" ("id" SERIAL NOT NULL, "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "email" character varying NOT NULL, "role" character varying NOT NULL, "phone" character varying NOT NULL, "password" character varying NOT NULL, CONSTRAINT "PK_3c2bc72f03fd5abbbc5ac169498" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "loyalty_point" ("id" SERIAL NOT NULL, "points" integer NOT NULL, "expirationDate" TIMESTAMP NOT NULL, "customerId" integer, CONSTRAINT "PK_d639711df65f35a798b58c7b3f8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "recipes" ADD CONSTRAINT "FK_20dc4152c040ab2173989493bd4" FOREIGN KEY ("menuItemMenuItemId") REFERENCES "menu_items"("menu_item_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "recipes" ADD CONSTRAINT "FK_07b20a180cc41bd585ccc435905" FOREIGN KEY ("ingredientInventoryId") REFERENCES "inventory"("inventory_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order_detail" ADD CONSTRAINT "FK_88850b85b38a8a2ded17a1f5369" FOREIGN KEY ("orderId") REFERENCES "order"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order_detail" ADD CONSTRAINT "FK_8167a065e6dd44e1a81bb11592b" FOREIGN KEY ("inventoryInventoryId") REFERENCES "inventory"("inventory_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order" ADD CONSTRAINT "FK_124456e637cca7a415897dce659" FOREIGN KEY ("customerId") REFERENCES "customer"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order" ADD CONSTRAINT "FK_9b451675cd9fe227a0dd5120e53" FOREIGN KEY ("employeeId") REFERENCES "employee"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "loyalty_point" ADD CONSTRAINT "FK_459d7cb0f005a23c1732b4bd921" FOREIGN KEY ("customerId") REFERENCES "customer"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "loyalty_point" DROP CONSTRAINT "FK_459d7cb0f005a23c1732b4bd921"`);
        await queryRunner.query(`ALTER TABLE "order" DROP CONSTRAINT "FK_9b451675cd9fe227a0dd5120e53"`);
        await queryRunner.query(`ALTER TABLE "order" DROP CONSTRAINT "FK_124456e637cca7a415897dce659"`);
        await queryRunner.query(`ALTER TABLE "order_detail" DROP CONSTRAINT "FK_8167a065e6dd44e1a81bb11592b"`);
        await queryRunner.query(`ALTER TABLE "order_detail" DROP CONSTRAINT "FK_88850b85b38a8a2ded17a1f5369"`);
        await queryRunner.query(`ALTER TABLE "recipes" DROP CONSTRAINT "FK_07b20a180cc41bd585ccc435905"`);
        await queryRunner.query(`ALTER TABLE "recipes" DROP CONSTRAINT "FK_20dc4152c040ab2173989493bd4"`);
        await queryRunner.query(`DROP TABLE "loyalty_point"`);
        await queryRunner.query(`DROP TABLE "employee"`);
        await queryRunner.query(`DROP TABLE "order"`);
        await queryRunner.query(`DROP TABLE "payment"`);
        await queryRunner.query(`DROP TABLE "order_detail"`);
        await queryRunner.query(`DROP TABLE "inventory"`);
        await queryRunner.query(`DROP TABLE "recipes"`);
        await queryRunner.query(`DROP TABLE "menu_items"`);
        await queryRunner.query(`DROP TABLE "customer"`);
    }

}
