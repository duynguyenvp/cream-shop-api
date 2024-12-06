import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
@Entity()
export class LoyaltyPoint {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  customerId: number;

  @Column()
  points: number;

  @Column()
  expirationDate: Date;
}
