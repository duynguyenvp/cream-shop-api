import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
@Entity('menu_items')
export class MenuItem {
  @PrimaryGeneratedColumn()
  menu_item_id: number;

  @Column()
  name: string;  // Tên món ăn

  @Column()
  description: string;  // Mô tả món ăn

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;  // Giá món ăn
}
