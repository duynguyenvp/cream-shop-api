import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
} from "typeorm";
@Entity("recipes")
export class Recipe {
  @PrimaryGeneratedColumn()
  recipe_id: number;

  @Column()
  menuItemId: number;

  @Column()
  ingredientId: number;

  @Column("decimal", { precision: 10, scale: 2 })
  quantity: number;

  @Column()
  unit: string;
}
