import { EntityManager, Repository } from "typeorm";
import { OrderDetail } from "../models/OrderDetail";
import { InventoryRepository } from "./InventoryRepository";

export class OrderDetailRepository {
  private repository: Repository<OrderDetail>;
  private inventoryRepository: InventoryRepository;

  constructor(
    _repository: Repository<OrderDetail>,
    _inventoryRepository: InventoryRepository,
    manager?: EntityManager
  ) {
    if (manager) {
      this.repository = manager.getRepository(OrderDetail);
    } else {
      this.repository = _repository;
    }
    this.inventoryRepository = _inventoryRepository;
  }

  // Kiểm tra xem sản phẩm/nguyên liệu có tồn tại không
  private async checkInventoryExists(inventoryId: number): Promise<boolean> {
    const inventory = await this.inventoryRepository.getInventoryById(
      inventoryId
    );
    return !!inventory;
  }

  // Thêm chi tiết đơn hàng mới với tham số là đối tượng OrderDetail
  async addOrderDetail(
    orderId: number,
    orderDetail: OrderDetail
  ): Promise<OrderDetail> {

    // Kiểm tra xem sản phẩm/nguyên liệu có tồn tại không
    const inventoryExists = await this.checkInventoryExists(
      orderDetail.inventoryId
    );
    if (!inventoryExists) {
      throw new Error("Inventory not found");
    }

    // Tạo chi tiết đơn hàng và lưu vào cơ sở dữ liệu
    const item = this.repository.create({
      orderId: orderId, // Liên kết với đơn hàng
      inventoryId: orderDetail.inventoryId,
      price: orderDetail.price,
      quantity: orderDetail.quantity
    });
    return await this.repository.save(item);
  }

  // Cập nhật chi tiết đơn hàng
  async updateOrderDetail(
    orderDetailId: number,
    quantity: number,
    price: number
  ): Promise<OrderDetail> {
    const orderDetail = await this.repository.findOne({
      where: { id: orderDetailId },
      relations: ["order", "inventory"]
    });
    if (!orderDetail) {
      throw new Error("OrderDetail not found");
    }

    orderDetail.quantity = quantity;
    orderDetail.price = price;

    return await this.repository.save(orderDetail);
  }

  // Lấy chi tiết đơn hàng theo ID
  async getOrderDetailById(orderDetailId: number): Promise<OrderDetail> {
    const orderDetail = await this.repository.findOne({
      where: { id: orderDetailId },
      relations: ["order", "inventory"]
    });
    if (!orderDetail) {
      throw new Error("OrderDetail not found");
    }
    return orderDetail;
  }

  // Lấy tất cả chi tiết đơn hàng của một đơn hàng
  async getOrderDetailsByOrderId(orderId: number): Promise<OrderDetail[]> {

    return await this.repository.find({
      where: { orderId: orderId },
      relations: ["order", "inventory"]
    });
  }

  // Xóa chi tiết đơn hàng
  async deleteOrderDetail(orderDetailId: number): Promise<void> {
    const orderDetail = await this.repository.findOne({
      where: { id: orderDetailId },
      relations: ["order", "inventory"]
    });
    if (!orderDetail) {
      throw new Error("OrderDetail not found");
    }

    await this.repository.remove(orderDetail);
  }
}
