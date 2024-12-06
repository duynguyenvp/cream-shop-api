import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class OrderDetail {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  orderId: number;
  
  @Column()
  inventoryId: number;

  // Số lượng sản phẩm/nguyên liệu trong đơn hàng
  @Column("decimal", { precision: 10, scale: 2 })
  quantity: number;

  // Giá của sản phẩm/nguyên liệu trong chi tiết đơn hàng
  @Column("decimal", { precision: 10, scale: 2 })
  price: number;
}
