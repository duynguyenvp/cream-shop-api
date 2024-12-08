import { DataSource, Repository } from 'typeorm';
import { Inventory } from '../models/Inventory';
import PaginatedInventories from '../../dto/paginatedInventory.dto';

export class InventoryRepository {
  private repository: Repository<Inventory>;

  constructor(datasouce: DataSource) {
    this.repository = datasouce.getRepository(Inventory);
  }

  // Thêm một inventory mới
  async createInventory(name: string, price: number, quantity: number): Promise<Inventory> {
    const inventory = this.repository.create({
      name,
      price,
      in_stock: quantity,
    });
    return await this.repository.save(inventory);
  }

  // Cập nhật thông tin inventory
  async updateInventory(inventoryId: number, name: string, price: number, quantity: number): Promise<Inventory> {
    const inventory = await this.repository.findOne({ where: { inventory_id: inventoryId } });
    if (inventory) {
      inventory.name = name;
      inventory.price = price;
      inventory.in_stock = quantity;
      return await this.repository.save(inventory);
    }
    throw new Error('Inventory not found');
  }

  // Lấy danh sách tất cả các inventory
  async getAllInventory(
    pageIndex: number,
    pageSize: number,
    name: string
  ): Promise<PaginatedInventories> {
    const queryBuilder = this.repository.createQueryBuilder("inventory");
    if (name) {
      queryBuilder.andWhere("inventory.name LIKE :name", {
        name: `%${name}%`
      });
    }
    queryBuilder.skip((pageIndex - 1) * pageSize).take(pageSize);
    const [ingredients, total] = await queryBuilder.getManyAndCount();
    return {
      pageIndex,
      pageSize,
      total,
      data: ingredients
    };
  }

  // Lấy một inventory theo ID
  async getInventoryById(inventoryId: number): Promise<Inventory> {
    const inventory = await this.repository.findOne({ where: { inventory_id: inventoryId } });
    if (!inventory) {
      throw new Error('Inventory not found');
    }
    return inventory;
  }

  // Xóa một inventory
  async deleteInventory(inventoryId: number): Promise<Inventory> {
    const inventory = await this.repository.findOne({ where: { inventory_id: inventoryId } });
    if (!inventory) {
      throw new Error('Inventory not found');
    }
    return this.repository.remove(inventory);
  }

  // Tìm kiếm inventory theo tên
  async searchInventoryByName(name: string): Promise<Inventory[]> {
    return await this.repository.find({
      where: {
        name: name, // Có thể thay đổi logic tìm kiếm nếu cần thiết
      },
    });
  }

  // Cập nhật số lượng tồn kho khi bán
  async updateQuantity(inventoryId: number, quantitySold: number): Promise<Inventory> {
    const inventory = await this.repository.findOne({ where: { inventory_id: inventoryId } });
    if (!inventory) {
      throw new Error('Inventory not found');
    }
    inventory.in_stock -= quantitySold;
    return await this.repository.save(inventory);
  }

  // Cập nhật giá nguyên liệu
  async updatePrice(inventoryId: number, newPrice: number): Promise<Inventory> {
    const inventory = await this.repository.findOne({ where: { inventory_id: inventoryId } });
    if (!inventory) {
      throw new Error('Inventory not found');
    }
    inventory.price = newPrice;
    return await this.repository.save(inventory);
  }
}
