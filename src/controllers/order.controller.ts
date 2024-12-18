import { CreateOrderInputDTO, OrderResponseDTO } from "src/dto/order.dto";
import { OrderRepository } from "../db/repositories/orderRepository";
import { GraphQLResolveInfo } from "graphql";
import { getFieldPaths } from "../utils/checkRequestedField";
import PaginatedOrders from "../dto/paginatedOrder.dto";

export class OrderController {
  private orderRepository: OrderRepository;

  constructor(orderRepository: OrderRepository) {
    this.orderRepository = orderRepository;
  }
  // Tạo đơn hàng mới kèm theo các chi tiết đơn hàng
  async createOrder(data: CreateOrderInputDTO): Promise<OrderResponseDTO> {
    return this.orderRepository.createOrder(data);
  }

  async getOrders(
    info: GraphQLResolveInfo,
    pageIndex: number,
    pageSize: number,
    phone?: string,
    employeeId?: number,
  ): Promise<PaginatedOrders> {
    const requestedFields = getFieldPaths(info);
    let isCustomerFieldRequested = requestedFields.includes("data.customer");
    let isDetailFieldRequested = requestedFields.includes("data.orderDetail");
    let isEmployeeFieldRequested = requestedFields.includes("data.employee");

    return this.orderRepository.getAllOrders(
      isCustomerFieldRequested,
      isDetailFieldRequested,
      isEmployeeFieldRequested,
      pageIndex,
      pageSize,
      phone,
      employeeId
    );
  }

  async getOrder(
    info: GraphQLResolveInfo,
    id: number
  ): Promise<OrderResponseDTO> {
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
