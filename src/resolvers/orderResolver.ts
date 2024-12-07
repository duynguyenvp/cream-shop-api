import {
  Resolver,
  Mutation,
  Arg,
  Query,
  Info,
  FieldResolver,
  Root
} from "type-graphql";
import dataSource from "../db/dataSource";
import {
  CreateOrderInput,
  OrderDetailReponseDTO,
  OrderResponseDTO,
  OrderTestDTO
} from "../dto/order.dto";
import { OrderController } from "../controllers/order.controller";
import { OrderRepository } from "../db/repositories/orderRepository";
import { GraphQLResolveInfo } from "graphql";
import { CustomerResponse } from "../dto/customer.dto";
import UserDTO from "../dto/user.dto";

@Resolver(() => OrderResponseDTO)
export class OrderResolver {
  @Query(() => [OrderTestDTO])
  async orders(): Promise<OrderTestDTO[]> {
    const orderController = new OrderController(
      new OrderRepository(dataSource)
    );
    const orders = await orderController.getOrders();
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

  @FieldResolver(() => CustomerResponse)
  async customer(@Root() recipe: OrderResponseDTO): Promise<CustomerResponse> {
    return recipe.customer ?? new CustomerResponse();
  }

  @FieldResolver(() => UserDTO)
  async employee(@Root() recipe: OrderResponseDTO): Promise<UserDTO> {
    return recipe.employee ?? new UserDTO();
  }

  @FieldResolver(() => [OrderDetailReponseDTO])
  async orderDetail(
    @Root() recipe: OrderResponseDTO
  ): Promise<OrderDetailReponseDTO[]> {
    return recipe.orderDetail;
  }

  // Mutation để tạo Order mà không cần Payment
  @Mutation(() => OrderTestDTO)
  async createOrder(
    @Arg("data") data: CreateOrderInput
  ): Promise<OrderTestDTO> {
    const orderController = new OrderController(
      new OrderRepository(dataSource)
    );
    return await orderController.createOrder(data);
  }
}
