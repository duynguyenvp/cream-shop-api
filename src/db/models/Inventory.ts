import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
@Entity('inventory')
export class Inventory {
  @PrimaryGeneratedColumn()
  inventory_id: number;

  @Column()
  name: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column('decimal', { precision: 10, scale: 2 })
  in_stock: number;
}
