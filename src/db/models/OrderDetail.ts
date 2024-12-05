import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, Relation } from "typeorm";
import { Order } from "./Order"; // Liên kết với bảng Order
import { Inventory } from "./Inventory"; // Liên kết với bảng Inventory (nguyên liệu/sản phẩm)

@Entity()
export class OrderDetail {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Order, order => order.orderDetails)
  order: Relation<Order>;
  // Liên kết với bảng Inventory để biết nguyên liệu/sản phẩm nào được đặt trong chi tiết đơn hàng
  @ManyToOne(() => Inventory, inventory => inventory.recipes)
  inventory: Relation<Inventory>;

  // Số lượng sản phẩm/nguyên liệu trong đơn hàng
  @Column("decimal", { precision: 10, scale: 2 })
  quantity: number;

  // Giá của sản phẩm/nguyên liệu trong chi tiết đơn hàng
  @Column("decimal", { precision: 10, scale: 2 })
  price: number;
}
