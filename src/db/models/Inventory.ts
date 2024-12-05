import { Entity, PrimaryGeneratedColumn, Column, OneToMany, Relation } from 'typeorm';
import { Recipe } from './Recipe';  // Liên kết với bảng Recipe

@Entity('inventory')
export class Inventory {
  @PrimaryGeneratedColumn()
  inventory_id: number;

  @Column()
  name: string;  // Tên nguyên liệu hoặc sản phẩm

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;  // Giá nguyên liệu

  @Column('decimal', { precision: 10, scale: 2 })
  quantity: number;  // Số lượng tồn kho

  @OneToMany(() => Recipe, (recipe) => recipe.ingredient)
  recipes: Relation<Recipe>[];  // Một nguyên liệu có thể dùng trong nhiều công thức
}
