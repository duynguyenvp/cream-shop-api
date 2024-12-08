import { Resolver, Mutation, Arg, Query, Info } from "type-graphql";
import dataSource from "../db/dataSource";
import {
  CreateOrderInputDTO,
  OrderResponseDTO
} from "../dto/order.dto";
import { OrderController } from "../controllers/order.controller";
import { OrderRepository } from "../db/repositories/orderRepository";
import { GraphQLResolveInfo } from "graphql";
import PaginatedOrders from "../dto/paginatedOrder.dto";

@Resolver(() => OrderResponseDTO)
export class OrderResolver {
  @Query(() => PaginatedOrders)
  async orders(
    @Arg("phone", { nullable: true }) phone: string,
    @Arg("employeeId", { nullable: true }) employeeId: number,
    @Arg("pageIndex") pageIndex: number,
    @Arg("pageSize") pageSize: number,
    @Info() info: GraphQLResolveInfo
  ): Promise<PaginatedOrders> {
    const orderController = new OrderController(
      new OrderRepository(dataSource)
    );
    const orders = await orderController.getOrders(
      info,
      pageIndex,
      pageSize,
      phone,
      employeeId
    );
    return orders;
  }

  @Query(() => OrderResponseDTO)
  async order(
    @Arg("id") id: number,
    @Info() info: GraphQLResolveInfo
  ): Promise<OrderResponseDTO | null> {
    const orderController = new OrderController(
      new OrderRepository(dataSource)
    );
    const order = await orderController.getOrder(info, id);
    return order;
  }

  @Mutation(() => OrderResponseDTO)
  async createOrder(
    @Arg("data") data: CreateOrderInputDTO
  ): Promise<OrderResponseDTO> {
    const orderController = new OrderController(
      new OrderRepository(dataSource)
    );
    return await orderController.createOrder(data);
  }
}
