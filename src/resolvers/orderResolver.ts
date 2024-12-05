import { Resolver, Mutation, Arg, Query } from 'type-graphql';
import { Order } from '../db/models/Order';
import dataSource from '../db/dataSource';
import { Payment } from '../db/models/Payment';
import { Customer } from '../db/models/Customer';
import { Employee } from '../db/models/Employee';

@Resolver()
export class OrderResolver {
  // Mutation để tạo Order mà không cần Payment
  @Mutation(() => Order)
  async createOrder(
    @Arg('customer_id') customer_id: number,
    @Arg('employee_id') employee_id: number,
    @Arg('total_amount') total_amount: number,
  ): Promise<Order> {
    const orderRepository = dataSource.getRepository(Order);

    const order = new Order();
    order.customer = await dataSource.getRepository(Customer).findOneOrFail({ where: { id: customer_id } });
    order.employee = await dataSource.getRepository(Employee).findOneOrFail({ where: { id: employee_id } });
    order.totalPrice = total_amount;

    return await orderRepository.save(order);
  }

  @Mutation(() => Order)
  async addPaymentToOrder(
    @Arg('order_id') order_id: number,
    @Arg('amount') amount: number,
    @Arg('payment_method') payment_method: string
  ): Promise<Order> {
    const orderRepository = dataSource.getRepository(Order);
    const paymentRepository = dataSource.getRepository(Payment);

    const order = await orderRepository.findOne({ where: { id: order_id }, relations: ['payment'] });

    if (!order) {
      throw new Error('Order not found');
    }

    // Tạo Payment
    const payment = new Payment();
    payment.amount = amount;
    payment.method = payment_method;
    payment.order = order;

    // Lưu thanh toán
    await paymentRepository.save(payment);

    // Cập nhật Payment trong Order
    order.payment = payment;
    return await orderRepository.save(order);
  }

  // Query lấy thông tin Order
  @Query(() => Order)
  async getOrder(@Arg('order_id') order_id: number): Promise<Order | null> {
    const orderRepository = dataSource.getRepository(Order);
    return await orderRepository.findOne({ where: { id: order_id }, relations: ['payment'] });
  }
}
