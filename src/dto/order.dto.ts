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
  @Field({ nullable: true })
  id: number;

  @Field()
  orderId: number;

  @Field({ nullable: true })
  menuItem: MenuItemResponse;

  @Field()
  quantity: number;

  @Field()
  price: number;

  constructor();
  constructor(
    id: number,
    orderId: number,
    menuItem: MenuItemResponse,
    quantity: number,
    price: number
  );

  constructor(
    id?: number,
    orderId?: number,
    menuItem?: MenuItemResponse,
    quantity?: number,
    price?: number
  ) {
    this.id = id ?? 0;
    this.orderId = orderId ?? 0;
    this.menuItem = menuItem ?? new MenuItemResponse();
    this.quantity = quantity ?? 0;
    this.price = price ?? 0;
  }

  static createOrderDetailReponseDTOFromRawData(rawData: any) {
    const menuItem =
      MenuItemResponse.createMenuItemResponseFromRawData(rawData);
    return new OrderDetailReponseDTO(
      rawData.orderDetail_id,
      rawData.orderDetail_orderId,
      menuItem,
      Number(rawData.orderDetail_quantity),
      Number(rawData.orderDetail_price)
    );
  }
}

@ObjectType()
export class OrderResponseDTO {
  @Field()
  id: number;

  @Field(() => CustomerResponse, { nullable: true })
  customer?: CustomerResponse;

  @Field(() => UserDTO)
  employee: UserDTO;

  @Field()
  totalPrice: number;

  @Field()
  status: string;

  @Field({ nullable: true })
  payment?: number;

  @Field(() => [OrderDetailReponseDTO])
  orderDetail: OrderDetailReponseDTO[];

  constructor();
  constructor(
    id: number,
    customer: CustomerResponse | undefined,
    employee: UserDTO,
    totalPrice: number,
    status: string,
    payment: number | undefined,
    orderDetail: OrderDetailReponseDTO[]
  );

  constructor(
    id?: number,
    customer?: CustomerResponse,
    employee?: UserDTO,
    totalPrice?: number,
    status?: string,
    payment?: number,
    orderDetail?: OrderDetailReponseDTO[]
  ) {
    if (id && employee && totalPrice && status && orderDetail) {
      this.id = id;
      this.customer = customer;
      this.employee = employee;
      this.totalPrice = totalPrice;
      this.status = status;
      this.payment = payment;
      this.orderDetail = orderDetail;
    } else {
      this.id = 0;
      this.customer = undefined;
      this.employee = new UserDTO();
      this.totalPrice = 0;
      this.status = "";
      this.payment = undefined;
      this.orderDetail = [];
    }
  }

  static setDetailsFromRawData(orderDTO: OrderResponseDTO, rawData: any[]) {
    const orderDetail = rawData
      .filter(f => f.orderDetail_orderId === orderDTO.id)
      .map(rawDetail => {
        const temp =
          OrderDetailReponseDTO.createOrderDetailReponseDTOFromRawData(
            rawDetail
          );
        return temp;
      });
    return { ...orderDTO, orderDetail };
  }
  static createOrderDtoFromRawData(rawData: any) {
    const customer = CustomerResponse.createCustomerFromRawData(rawData);
    const employee = UserDTO.createUserFromRawData(rawData);
    return new OrderResponseDTO(
      rawData.order_id,
      customer,
      employee,
      rawData.order_totalPrice,
      rawData.order_status,
      rawData.order_paymentId,
      []
    );
  }
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
