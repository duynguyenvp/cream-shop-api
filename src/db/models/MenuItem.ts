import { Entity, PrimaryGeneratedColumn, Column, OneToMany, Relation } from 'typeorm';
import { Recipe } from './Recipe';  // Liên kết với bảng Recipe

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

  @OneToMany(() => Recipe, (recipe) => recipe.menuItem)
  recipes: Relation<Recipe>[];  // Một món ăn có thể có nhiều công thức
}
