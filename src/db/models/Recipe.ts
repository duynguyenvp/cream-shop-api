import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  Relation
} from "typeorm";
import { MenuItem } from "./MenuItem";
import { Inventory } from "./Inventory";
@Entity("recipes")
export class Recipe {
  @PrimaryGeneratedColumn()
  recipe_id: number;

  @ManyToOne(() => MenuItem, menuItem => menuItem.recipes)
  menuItem: Relation<MenuItem>;

  @ManyToOne(() => Inventory, inventory => inventory)
  ingredient: Relation<Inventory>;

  @Column("decimal", { precision: 10, scale: 2 })
  quantity: number;

  @Column()
  unit: string;
}
