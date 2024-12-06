import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
@Entity("customer")
export class Customer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email?: string;

  @Column()
  phone: string;
}
