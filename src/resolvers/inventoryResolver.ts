import { InventoryController } from "../controllers/inventory.controller";
import { Inventory } from "../db/models/Inventory";
import { CreateInventoryInput, InventoryResponse, UpdateInventoryInput } from "../dto/inventory.dto";
import { Resolver, Query, Mutation, Arg } from "type-graphql";
import dataSource from "../db/dataSource";
import { InventoryRepository } from "../db/repositories/InventoryRepository";

@Resolver()
export class InventoryResolver {
  
  // Truy vấn tất cả sản phẩm
  @Query(() => [InventoryResponse])
  async inventories(): Promise<Inventory[]> {
    const inventoryController = new InventoryController(new InventoryRepository(dataSource));
    return inventoryController.getAllInventories();
  }

  // Truy vấn một sản phẩm theo ID
  @Query(() => InventoryResponse, { nullable: true })
  async inventory(@Arg("inventory_id") inventory_id: number): Promise<Inventory | undefined> {
    const inventoryController = new InventoryController(new InventoryRepository(dataSource));
    return inventoryController.getInventory(inventory_id);
  }

  // Tạo một sản phẩm mới
  @Mutation(() => InventoryResponse)
  async createInventory(@Arg("data") data: CreateInventoryInput): Promise<Inventory> {
    const inventoryController = new InventoryController(new InventoryRepository(dataSource));
    return inventoryController.createInventory(data);
  }

  // Cập nhật một sản phẩm
  @Mutation(() => InventoryResponse)
  async updateInventory(@Arg("data") data: UpdateInventoryInput): Promise<Inventory> {
    const inventoryController = new InventoryController(new InventoryRepository(dataSource));
    return inventoryController.updateInventory(data);
  }

  // Xóa một sản phẩm
  @Mutation(() => Boolean)
  async deleteInventory(@Arg("inventory_id") inventory_id: number): Promise<boolean> {
    const inventoryController = new InventoryController(new InventoryRepository(dataSource));
    return inventoryController.deleteInventory(inventory_id);
  }
}
