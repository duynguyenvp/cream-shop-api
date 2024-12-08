import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BeforeInsert,
  BeforeUpdate,
  Index
} from "typeorm";
import { ROLES_ENUM } from "../roles";
import dataSource from "../dataSource";

@Entity("employee")
@Index("employee_search_vector_idx", ["search_vector"], { unique: true })
export class Employee {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column({ default: ROLES_ENUM.EMPLOYEE_ROLE })
  role: string;

  @Column({ nullable: true })
  phone?: string;

  @Column()
  password: string;

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
