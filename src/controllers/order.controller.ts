import { CreateOrderInput, OrderResponseDTO } from "src/dto/order.dto";
import { Order } from "../db/models/Order";
import { OrderRepository } from "../db/repositories/orderRepository";
import { GraphQLResolveInfo } from "graphql";
import { getFieldPaths } from "../utils/checkRequestedField";

export class OrderController {
  private orderRepository: OrderRepository;

  constructor(orderRepository: OrderRepository) {
    this.orderRepository = orderRepository;
  }
  // Tạo đơn hàng mới kèm theo các chi tiết đơn hàng
  async createOrder(data: CreateOrderInput): Promise<Order> {
    return this.orderRepository.createOrder(data);
  }

  async getOrders(): Promise<Order[]> {
    return this.orderRepository.getAllOrders();
  }

  async getOrder(info: GraphQLResolveInfo, id: number): Promise<OrderResponseDTO> {
    const requestedFields = getFieldPaths(info);
    let isCustomerFieldRequested = requestedFields.includes("customer");
    let isDetailFieldRequested = requestedFields.includes("orderDetail");
    let isEmployeeFieldRequested = requestedFields.includes("employee");
    return this.orderRepository.getOrderById(
      id,
      isCustomerFieldRequested,
      isDetailFieldRequested,
      isEmployeeFieldRequested
    );
  }
}
