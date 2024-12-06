import { CreateOrderInput } from "src/dto/order.dto";
import { UnitOfWork } from "../db/unitOfWork";
import { Order } from "src/db/models/Order";

export class OrderController {
  private unitOfWork: UnitOfWork;

  constructor(uow?: UnitOfWork) {
    if (!uow) throw new Error("uow error");
    this.unitOfWork = uow;
  }
  // Tạo đơn hàng mới kèm theo các chi tiết đơn hàng
  async createOrder(data: CreateOrderInput): Promise<Order> {
    return this.unitOfWork.orderRepository.createOrder(data);
  }

  async getOrders(): Promise<Order[]> {
    return this.unitOfWork.orderRepository.getAllOrders();
  }
}
