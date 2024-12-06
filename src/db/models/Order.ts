import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  customerId?: number;

  @Column()
  employeeId: number;

  @Column()
  totalPrice: number;

  @Column()
  status: string;

  @Column()
  paymentId: number;
}
