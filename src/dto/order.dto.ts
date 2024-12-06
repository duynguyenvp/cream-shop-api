
import { InputType, Field, Float, Int, ObjectType } from "type-graphql";
import { CustomerResponse } from "./customer.dto";
import UserDTO from "./user.dto";
import { MenuItemResponse } from "./menuItem.dto";

@InputType()
export class CreateOrderInput {
  @Field(() => Int, { nullable: true })
  customerId?: number;

  @Field()
  employeeId: number;
  
  @Field()
  status: string;

  @Field(() => Int, { nullable: true })
  paymentId?: number;

  @Field(() => [CreateOrderDetailInput])
  orderDetails: CreateOrderDetailInput[];
}

@InputType()
export class CreateOrderDetailInput {
  @Field(() => Int)
  menuItemId: number;

  @Field(() => Float)
  quantity: number;
}

@ObjectType()
export class OrderDetailReponseDTO {
  @Field()
  id: number;

  @Field()
  orderId: number;
  
  @Field()
  menuItem: MenuItemResponse;

  @Field()
  quantity: number;

  @Field()
  price: number;
}

@ObjectType()
export class OrderResponseDTO {
  @Field()
  id: number;

  @Field(() => CustomerResponse, { nullable: true})
  customer?: CustomerResponse;

  @Field(() => UserDTO)
  employee: UserDTO;

  @Field()
  totalPrice: number;

  @Field()
  status: string;

  @Field({ nullable: true })
  payment?: number;

  @Field(() => OrderDetailReponseDTO)
  orderDetail: OrderDetailReponseDTO[];
}

@ObjectType()
export class OrderTestDTO {
  @Field()
  id: number;

  @Field({ nullable: true })
  customerId?: number;

  @Field()
  employeeId: number;

  @Field()
  totalPrice: number;

  @Field()
  status: string;

  @Field({ nullable: true })
  paymentId?: number;
}
