import { MigrationInterface, QueryRunner } from "typeorm";

export class ImplementFullTextSearch1733643051818
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query("CREATE EXTENSION IF NOT EXISTS pg_trgm");
    await queryRunner.query("CREATE EXTENSION IF NOT EXISTS unaccent");

    //Customer
    await queryRunner.query(`
        ALTER TABLE customer
        ADD COLUMN search_vector tsvector;
      `);
    await queryRunner.query(`
        UPDATE customer
        SET search_vector = to_tsvector('simple', unaccent(coalesce(name, '')));
      `);
    await queryRunner.query(`
        CREATE INDEX customer_search_vector_idx ON customer USING gin(search_vector);
      `);

    //Employee
    await queryRunner.query(`
      ALTER TABLE employee
      ADD COLUMN search_vector tsvector;
    `);
    await queryRunner.query(`
      UPDATE employee
      SET search_vector = to_tsvector('simple', unaccent(coalesce(name, '')));
    `);
    await queryRunner.query(`
      CREATE INDEX employee_search_vector_idx ON employee USING gin(search_vector);
    `);

    //Inventory
    await queryRunner.query(`
      ALTER TABLE inventory
      ADD COLUMN search_vector tsvector;
    `);
    await queryRunner.query(`
      UPDATE inventory
      SET search_vector = to_tsvector('simple', unaccent(coalesce(name, '')));
    `);
    await queryRunner.query(`
      CREATE INDEX inventory_search_vector_idx ON inventory USING gin(search_vector);
    `);

    //MenuItem
    await queryRunner.query(`
      ALTER TABLE menu_items
      ADD COLUMN search_vector tsvector;
    `);
    await queryRunner.query(`
      UPDATE menu_items
      SET search_vector = to_tsvector('simple', unaccent(coalesce(name, '')));
    `);
    await queryRunner.query(`
      CREATE INDEX menu_items_search_vector_idx ON menu_items USING gin(search_vector);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query("DROP EXTENSION IF EXISTS pg_trgm");
    await queryRunner.query("DROP EXTENSION IF EXISTS unaccent");

    //Customer
    // Xóa chỉ mục GIN
    await queryRunner.query(`
      DROP INDEX IF EXISTS customer_search_vector_idx;
    `);
    // Xóa trường search_vector
    await queryRunner.query(`
      ALTER TABLE customer
      DROP COLUMN search_vector;
    `);

    //Employee
    await queryRunner.query(`
      DROP INDEX IF EXISTS employee_search_vector_idx;
    `);
    await queryRunner.query(`
      ALTER TABLE employee
      DROP COLUMN search_vector;
    `);

    //Inventory
    await queryRunner.query(`
      DROP INDEX IF EXISTS inventory_search_vector_idx;
    `);
    await queryRunner.query(`
      ALTER TABLE inventory
      DROP COLUMN search_vector;
    `);

    //Inventory
    await queryRunner.query(`
      DROP INDEX IF EXISTS menu_items_search_vector_idx;
    `);
    await queryRunner.query(`
      ALTER TABLE menu_items
      DROP COLUMN search_vector;
    `);
  }
}
