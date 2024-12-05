import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn, OneToOne, Relation } from 'typeorm';
import { Customer } from './Customer';
import { Employee } from './Employee';
import { OrderDetail } from './OrderDetail';
import { Payment } from './Payment';  // Liên kết với bảng Payment

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Customer, (customer) => customer.orders)
  @JoinColumn()
  customer: Relation<Customer>;

  @ManyToOne(() => Employee, (employee) => employee.orders)
  @JoinColumn()
  employee: Relation<Employee>;

  @Column()
  totalPrice: number;

  @Column()
  status: string;

  @OneToMany(() => OrderDetail, (orderDetail) => orderDetail.order)
  orderDetails: Relation<OrderDetail>[];

  @OneToOne(() => Payment, (payment) => payment.order, { nullable: true })
  payment: Relation<Payment>;
}
