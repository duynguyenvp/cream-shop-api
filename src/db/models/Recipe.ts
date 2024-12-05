import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, Relation } from 'typeorm';
import { MenuItem } from './MenuItem';  // Liên kết với bảng MenuItem
import { Inventory } from './Inventory';  // Liên kết với bảng Inventory (nguyên liệu)

@Entity('recipes')
export class Recipe {
  @PrimaryGeneratedColumn()
  recipe_id: number;

  // Liên kết với MenuItem để biết món ăn nào sử dụng công thức này
  @ManyToOne(() => MenuItem, (menuItem) => menuItem.recipes)
  menuItem: Relation<MenuItem>;

  // Liên kết với Inventory để biết nguyên liệu từ kho được sử dụng trong công thức
  @ManyToOne(() => Inventory, (inventory) => inventory)
  ingredient: Relation<Inventory>;

  // Số lượng nguyên liệu cần dùng cho món ăn
  @Column('decimal', { precision: 10, scale: 2 })
  quantity: number;

  // Đơn vị của nguyên liệu (ví dụ: gram, lít, cái, v.v.)
  @Column()
  unit: string;
}
