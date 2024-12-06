import { EntityManager, Repository } from "typeorm";
import { CustomerRepository } from "./customerRepository";
import EmployeeRepository from "./employeeRepository";
import { PaymentRepository } from "./paymentRepository";
import { Order } from "../models/Order";
import { OrderDetailRepository } from "./orderDetailRepository";

export class OrderRepository {
  private repository: Repository<Order>;
  private customerRepository: CustomerRepository;
  private employeeRepository: EmployeeRepository;
  private orderDetailRepository: OrderDetailRepository;
  private paymentRepository: PaymentRepository;

  constructor(
    _repository: Repository<Order>,
    _customerRepository: CustomerRepository,
    _employeeRepository: EmployeeRepository,
    _orderDetailRepository: OrderDetailRepository,
    _paymentRepository: PaymentRepository,
    manager?: EntityManager
  ) {
    if (manager) {
      this.repository = manager.getRepository(Order);
    } else {
      this.repository = _repository;
    }
    this.customerRepository = _customerRepository;
    this.employeeRepository = _employeeRepository;
    this.orderDetailRepository = _orderDetailRepository;
    this.paymentRepository = _paymentRepository;
  }

  // Kiểm tra xem khách hàng có tồn tại không
  private async checkCustomerExists(customerId: number): Promise<boolean> {
    const customer = await this.customerRepository.getCustomerById(customerId);
    return !!customer;
  }

  // Kiểm tra xem nhân viên có tồn tại không
  private async checkEmployeeExists(employeeId: number): Promise<boolean> {
    const employee = await this.employeeRepository.findById(employeeId);
    return !!employee;
  }

  // Thêm một đơn hàng mới
  async addOrder(
    customerId: number,
    employeeId: number,
    totalPrice: number,
    status: string,
    orderDetails: any[],
    payment: any = null
  ): Promise<Order> {
    // Kiểm tra xem khách hàng và nhân viên có tồn tại không
    const customerExists = await this.checkCustomerExists(customerId);
    if (!customerExists) {
      throw new Error("Customer not found");
    }

    const employeeExists = await this.checkEmployeeExists(employeeId);
    if (!employeeExists) {
      throw new Error("Employee not found");
    }

    // Tạo đơn hàng
    const order = this.repository.create({
      customerId: customerId ,
      employeeId: employeeId ,
      totalPrice,
      status
    });

    // Lưu đơn hàng
    const savedOrder = await this.repository.save(order);

    // Thêm chi tiết đơn hàng (OrderDetails)
    for (const detail of orderDetails) {
      await this.orderDetailRepository.addOrderDetail(savedOrder.id, detail); // Giả sử method này thêm chi tiết đơn hàng
    }

    // Nếu có thanh toán, thêm thanh toán vào đơn hàng
    if (payment) {
      await this.paymentRepository.addPayment(
        payment.amount,
        payment.method
      );
    }

    return savedOrder;
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

  // Lấy thông tin đơn hàng theo ID
  async getOrderById(orderId: number): Promise<Order> {
    const order = await this.repository.findOne({
      where: { id: orderId },
      relations: ["customer", "employee", "orderDetails", "payment"]
    });
    if (!order) {
      throw new Error("Order not found");
    }
    return order;
  }

  // Lấy tất cả các đơn hàng
  async getAllOrders(): Promise<Order[]> {
    return await this.repository.find({
      relations: ["customer", "employee", "orderDetails", "payment"]
    });
  }

  // Lấy các đơn hàng của khách hàng
  async getOrdersByCustomerId(customerId: number): Promise<Order[]> {
    const customerExists = await this.checkCustomerExists(customerId);
    if (!customerExists) {
      throw new Error("Customer not found");
    }

    return await this.repository.find({
      where: { customerId: customerId },
      relations: ["customer", "employee", "orderDetails", "payment"]
    });
  }

  // Lấy các đơn hàng của nhân viên
  async getOrdersByEmployeeId(employeeId: number): Promise<Order[]> {
    const employeeExists = await this.checkEmployeeExists(employeeId);
    if (!employeeExists) {
      throw new Error("Employee not found");
    }

    return await this.repository.find({
      where: { employeeId: employeeId },
      relations: ["customer", "employee", "orderDetails", "payment"]
    });
  }

  // Xóa đơn hàng
  async deleteOrder(orderId: number): Promise<void> {
    const order = await this.repository.findOne({
      where: { id: orderId },
      relations: ["customer", "employee", "orderDetails", "payment"]
    });
    if (!order) {
      throw new Error("Order not found");
    }

    await this.repository.remove(order);
  }
}
