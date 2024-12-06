import { Resolver, Mutation, Arg, Query } from "type-graphql";
import dataSource from "../db/dataSource";
import { CreateOrderInput, OrderTestDTO } from "../dto/order.dto";
import { OrderController } from "../controllers/order.controller";
import { UnitOfWork } from "../db/unitOfWork";

@Resolver()
export class OrderResolver {
  @Query(() => [OrderTestDTO])
  async orders(): Promise<OrderTestDTO[]> {
    const orderController = new OrderController(new UnitOfWork(dataSource));
    const orders = await orderController.getOrders();
    return orders;
  }
  // Mutation để tạo Order mà không cần Payment
  @Mutation(() => OrderTestDTO)
  async createOrder(@Arg("data") data: CreateOrderInput): Promise<OrderTestDTO> {
    const orderController = new OrderController(new UnitOfWork(dataSource));
    return await orderController.createOrder(data);
  }
}
