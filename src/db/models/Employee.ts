import { Entity, PrimaryGeneratedColumn, Column, OneToMany, Relation } from 'typeorm';
import { Order } from './Order';  // Liên kết với bảng Order
import { EMPLOYEE_ROLE } from '../roles';

@Entity()
export class Employee {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column({ default: EMPLOYEE_ROLE })
  role: string;

  @Column({ nullable: true })
  phone?: string;

  @Column()
  password: string;

  @OneToMany(() => Order, (order) => order.employee)
  orders: Relation<Order>[];
}
