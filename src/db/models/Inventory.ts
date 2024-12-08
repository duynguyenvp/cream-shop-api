import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BeforeInsert,
  BeforeUpdate,
  Index
} from "typeorm";
import dataSource from "../dataSource";
@Entity("inventory")
@Index("inventory_search_vector_idx", ["search_vector"], { unique: true })
export class Inventory {
  @PrimaryGeneratedColumn()
  inventory_id: number;

  @Column()
  name: string;

  @Column("decimal", { precision: 10, scale: 2 })
  price: number;

  @Column("decimal", { precision: 10, scale: 2 })
  in_stock: number;

  // Trường search_vector, không cần phải insert trực tiếp vào cơ sở dữ liệu,
  // vì TypeORM sẽ tự động tính toán giá trị trong các phương thức @BeforeInsert/@BeforeUpdate
  @Column({ type: "tsvector", select: false })
  search_vector: string;

  // Tính toán và cập nhật search_vector khi thêm hoặc cập nhật khách hàng
  @BeforeInsert()
  @BeforeUpdate()
  async updateSearchVector() {
    const vector = await dataSource.query(`select to_tsvector('simple', unaccent('${this.name ?? ""}'))`);
    this.search_vector = vector[0].to_tsvector;
  }
}
