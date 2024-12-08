import {
  DataSource,
  DeepPartial,
  Repository,
  SelectQueryBuilder
} from "typeorm";
import { Order } from "../models/Order";
import { CreateOrderInputDTO, OrderResponseDTO } from "../../dto/order.dto";
import { OrderDetail } from "../models/OrderDetail";
import { MenuItem } from "../models/MenuItem";
import { Employee } from "../models/Employee";
import { Customer } from "../models/Customer";
import PaginatedOrders from "../../dto/paginatedOrder.dto";
import { checkExistedWhereCondition } from "../../utils/checkExistedWhereCondition";

export class OrderRepository {
  private repository: Repository<Order>;
  private _dataSource: DataSource;

  constructor(dataSource: DataSource) {
    this._dataSource = dataSource;
    this.repository = dataSource.getRepository(Order);
  }

  // Thêm một đơn hàng mới
  async createOrder(input: CreateOrderInputDTO): Promise<OrderResponseDTO> {
    return new Promise((resolve, _) => {
      this._dataSource.transaction(async manager => {
        const menus = await manager
          .createQueryBuilder(MenuItem, "menu")
          .where("menu.menu_item_id IN (:...menuIds)", {
            menuIds: input.orderDetails.map(od => `${od.menuItemId}`)
          })
          .select()
          .getMany();

        if (menus.length === 0 || menus.length !== input.orderDetails.length) {
          throw new Error("Please choose the right dishes.");
        }
        const totalPrice = menus.reduce((prev, currentValue) => {
          const menu = input.orderDetails.find(
            f => f.menuItemId === currentValue.menu_item_id
          );
          return prev + currentValue.price * (menu?.quantity ?? 1);
        }, 0);
        const employeeExists = await manager
          .createQueryBuilder(Employee, "employee")
          .where("employee.id = :id", { id: input.employeeId })
          .getOne();
        if (!employeeExists) {
          throw new Error("Employee not found");
        }

        let newOrder: DeepPartial<Order> = {
          employeeId: input.employeeId,
          totalPrice,
          status: input.status,
          paymentId: input.paymentId
        };
        if (input.customerId) {
          const customerExists = await manager
            .createQueryBuilder(Customer, "customer")
            .where("customer.id = :id", { id: input.customerId })
            .getOne();
          if (!customerExists) {
            throw new Error("Customer not found");
          }
          newOrder.customerId = customerExists.id;
        }

        const order = manager.getRepository(Order).create(newOrder);
        const savedOrder = await manager.getRepository(Order).save(order);

        const orderDetails: DeepPartial<OrderDetail[]> = input.orderDetails.map(
          od => {
            const selectedMenu = menus.find(
              f => f.menu_item_id === od.menuItemId
            );
            return {
              orderId: savedOrder.id,
              menuItemId: od.menuItemId,
              quantity: od.quantity,
              price: selectedMenu?.price ?? 0
            };
          }
        );
        await manager
          .createQueryBuilder()
          .insert()
          .into(OrderDetail)
          .values(orderDetails)
          .execute();

        const resoponse = this.getOrderById(savedOrder.id, true, true, true);
        resolve(resoponse);
      });
    });
  }

  // Cập nhật trạng thái đơn hàng
  async updateOrderStatus(orderId: number, status: string): Promise<Order> {
    const order = await this.repository.findOne({
      where: { id: orderId },
      relations: ["customer", "employee", "orderDetails", "payment"]
    });
    if (!order) {
      throw new Error("Order not found");
    }

    order.status = status;
    return await this.repository.save(order);
  }

  private getOrderDetail(orderId: number) {
    return this._dataSource
      .getRepository(OrderDetail)
      .createQueryBuilder("orderDetail")
      .leftJoinAndSelect(
        MenuItem,
        "menuitem",
        "menuitem.menu_item_id = orderDetail.menuItemId"
      )
      .where({
        orderId: orderId
      })
      .getRawMany();
  }
  private getOrderDetails(orderIds: number[]) {
    return this._dataSource
      .getRepository(OrderDetail)
      .createQueryBuilder("orderDetail")
      .leftJoinAndSelect(
        MenuItem,
        "menuitem",
        "menuitem.menu_item_id = orderDetail.menuItemId"
      )
      .where("orderDetail.orderId IN (:...orderIds)", { orderIds })
      .getRawMany();
  }

  private getOrderQueryBuilder(
    isCustomerFieldRequested = true,
    isEmployeeFieldRequested = true
  ): SelectQueryBuilder<Order> {
    const queryBuilder: SelectQueryBuilder<Order> =
      this.repository.createQueryBuilder("order");
    if (isCustomerFieldRequested) {
      queryBuilder.leftJoinAndSelect(
        Customer,
        "customer",
        "customer.id = order.customerId"
      );
    }
    if (isEmployeeFieldRequested) {
      queryBuilder.leftJoinAndSelect(
        Employee,
        "employee",
        "employee.id = order.employeeId"
      );
    }
    return queryBuilder;
  }

  // Lấy thông tin đơn hàng theo ID
  async getOrderById(
    orderId: number,
    isCustomerFieldRequested = true,
    isDetailFieldRequested = true,
    isEmployeeFieldRequested = true
  ): Promise<OrderResponseDTO> {
    const queryBuilder = this.getOrderQueryBuilder(
      isCustomerFieldRequested,
      isEmployeeFieldRequested
    );
    const rawOrder = await queryBuilder.where({ id: orderId }).getRawOne();
    if (!rawOrder) {
      throw new Error("Order not found");
    }
    let result: OrderResponseDTO =
      OrderResponseDTO.createOrderDtoFromRawData(rawOrder);
    if (isDetailFieldRequested) {
      const rawDetails = await this.getOrderDetail(orderId);
      result = OrderResponseDTO.setDetailsFromRawData(result, rawDetails);
    }
    return result;
  }

  // Lấy tất cả các đơn hàng
  async getAllOrders(
    isCustomerFieldRequested = true,
    isDetailFieldRequested = true,
    isEmployeeFieldRequested = true,
    pageIndex: number,
    pageSize: number,
    phone?: string,
    employeeId?: number
  ): Promise<PaginatedOrders> {
    const queryBuilder = this.getOrderQueryBuilder(
      isCustomerFieldRequested,
      isEmployeeFieldRequested
    );
    if (phone) {
      if (checkExistedWhereCondition(queryBuilder)) {
        queryBuilder.andWhere("customer.phone = :phone", { phone: phone });
      } else {
        queryBuilder.where("customer.phone = :phone", { phone: phone });
      }
    }
    if (employeeId) {
      if (checkExistedWhereCondition(queryBuilder)) {
        queryBuilder.andWhere({ employeeId: employeeId });
      } else {
        queryBuilder.where({ employeeId: employeeId });
      }
    }
    const totalRows = await queryBuilder.getCount();
    const rawOrders = await queryBuilder
      .skip((pageIndex - 1) * pageSize)
      .take(pageSize)
      .getRawMany();

    const orders: OrderResponseDTO[] = rawOrders.map(rawOrder =>
      OrderResponseDTO.createOrderDtoFromRawData(rawOrder)
    );
    if (isDetailFieldRequested && orders.length > 0) {
      const rawOrderDetails = await this.getOrderDetails(orders.map(o => o.id));
      const result = orders.map(order => {
        return OrderResponseDTO.setDetailsFromRawData(order, rawOrderDetails);
      });
      return {
        pageIndex,
        pageSize,
        total: totalRows,
        data: result
      };
    }
    return {
      pageIndex,
      pageSize,
      total: totalRows,
      data: orders
    };
  }

  // Lấy các đơn hàng của khách hàng
  async getOrdersByCustomerId(customerId: number): Promise<Order[]> {
    return await this.repository.find({
      where: { customerId: customerId }
    });
  }

  // Lấy các đơn hàng của nhân viên
  async getOrdersByEmployeeId(employeeId: number): Promise<Order[]> {
    return await this.repository.find({
      where: { employeeId: employeeId }
    });
  }

  // Xóa đơn hàng
  async deleteOrder(orderId: number): Promise<void> {
    const order = await this.repository.findOne({
      where: { id: orderId }
    });
    if (!order) {
      throw new Error("Order not found");
    }

    await this.repository.remove(order);
  }
}
