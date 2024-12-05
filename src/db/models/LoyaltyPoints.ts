import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Customer } from './Customer';  // Liên kết với bảng Customer

@Entity()
export class LoyaltyPoint {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Customer)
  customer: Customer;

  @Column()
  points: number;

  @Column()
  expirationDate: Date;
}
