import { Entity, PrimaryGeneratedColumn, Column, OneToOne, Relation } from 'typeorm';
import { Order } from './Order';  // Liên kết với bảng Order

@Entity()
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  amount: number;

  @Column()
  method: string;

  @OneToOne(() => Order, (order) => order.payment)
  order: Relation<Order>;
}
