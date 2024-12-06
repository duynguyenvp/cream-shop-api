import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
@Entity("menu_items")
export class MenuItem {
  @PrimaryGeneratedColumn()
  menu_item_id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  description?: string;

  @Column("decimal", { precision: 10, scale: 2, nullable: true })
  price?: number;
}
