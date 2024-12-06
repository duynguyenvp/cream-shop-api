import {
  CreateInventoryInput,
  UpdateInventoryInput
} from "../dto/inventory.dto";
import { Inventory } from "../db/models/Inventory";
import { UnitOfWork } from "../db/unitOfWork";

export class InventoryController {
  private unitOfWork: UnitOfWork;

  constructor(uow?: UnitOfWork) {
    if (!uow) throw new Error("uow error");
    this.unitOfWork = uow;
  }

  // Tạo mới một sản phẩm
  async createInventory(data: CreateInventoryInput): Promise<Inventory> {
    const { name, price, in_stock } = data;
    const inventory = this.unitOfWork.inventoryRepository.createInventory(
      name,
      price,
      in_stock
    );
    return inventory;
  }

  // Cập nhật sản phẩm
  async updateInventory(data: UpdateInventoryInput): Promise<Inventory> {
    const inventory = this.unitOfWork.inventoryRepository.updateInventory(
      data.inventory_id,
      data.name,
      data.price,
      data.in_stock
    );
    return inventory;
  }

  // Lấy danh sách tất cả sản phẩm
  async getAllInventories(): Promise<Inventory[]> {
    return this.unitOfWork.inventoryRepository.getAllInventory();
  }

  // Lấy thông tin sản phẩm theo ID
  async getInventory(inventory_id: number): Promise<Inventory | undefined> {
    return this.unitOfWork.inventoryRepository.getInventoryById(inventory_id);
  }

  // Xóa sản phẩm
  async deleteInventory(inventory_id: number): Promise<boolean> {
    const inventory = await this.unitOfWork.inventoryRepository.deleteInventory(inventory_id);
    if (!inventory) {
      throw new Error("Inventory item not found");
    }

    return true;
  }
}
