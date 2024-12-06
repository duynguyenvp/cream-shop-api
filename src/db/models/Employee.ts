import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { ROLES_ENUM } from '../roles';

@Entity("employee")
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
}
