import { Repository } from "typeorm";
import { Payment } from "../models/Payment";

export class PaymentRepository {
  private repository: Repository<Payment>;

  constructor(_repository: Repository<Payment>) {
    this.repository = _repository;
  }

  // Thêm một thanh toán cho đơn hàng
  async addPayment(amount: number, method: string): Promise<Payment> {
    // Tạo đối tượng Payment và lưu vào cơ sở dữ liệu
    const payment = this.repository.create({
      amount,
      method
    });

    return await this.repository.save(payment);
  }

  // Cập nhật thông tin thanh toán
  async updatePayment(
    paymentId: number,
    amount: number,
    method: string
  ): Promise<Payment> {
    const payment = await this.repository.findOne({
      where: { id: paymentId }
    });
    if (payment) {
      payment.amount = amount;
      payment.method = method;
      return await this.repository.save(payment);
    }

    throw new Error("Payment not found");
  }

  // Lấy tất cả thanh toán
  async getAllPayments(): Promise<Payment[]> {
    return await this.repository.find();
  }

  // Lấy thông tin thanh toán theo ID
  async getPaymentById(paymentId: number): Promise<Payment> {
    const payment = await this.repository.findOne({
      where: { id: paymentId }
    });
    if (!payment) {
      throw new Error("Payment not found");
    }
    return payment;
  }

  // Xóa thanh toán của đơn hàng
  async deletePayment(paymentId: number): Promise<void> {
    const payment = await this.repository.findOne({
      where: { id: paymentId }
    });
    if (!payment) {
      throw new Error("Payment not found");
    }
    await this.repository.remove(payment);
  }

  // Lấy thanh toán của đơn hàng theo Order ID
  async getPaymentByOrderId(orderId: number): Promise<Payment> {
    const payment = await this.repository.findOne({
      where: { orderId: orderId  }
    });
    if (!payment) {
      throw new Error("Payment not found for this order");
    }
    return payment;
  }
}
