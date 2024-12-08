import { InventoryController } from "../controllers/inventory.controller";
import { Inventory } from "../db/models/Inventory";
import { CreateInventoryInputDTO, InventoryResponseDTO, UpdateInventoryInputDTO } from "../dto/inventory.dto";
import { Resolver, Query, Mutation, Arg } from "type-graphql";
import dataSource from "../db/dataSource";
import { InventoryRepository } from "../db/repositories/InventoryRepository";
import PaginatedInventories from "../dto/paginatedInventory.dto";

@Resolver()
export class InventoryResolver {
  
  // Truy vấn tất cả sản phẩm
  @Query(() => PaginatedInventories)
  async inventories(
    @Arg("pageIndex") pageIndex: number,
    @Arg("pageSize") pageSize: number,
    @Arg("name", { nullable: true }) name: string
  ): Promise<PaginatedInventories> {
    const inventoryController = new InventoryController(new InventoryRepository(dataSource));
    return inventoryController.getAllInventories(pageIndex, pageSize, name);
  }

  // Truy vấn một sản phẩm theo ID
  @Query(() => InventoryResponseDTO, { nullable: true })
  async inventory(@Arg("inventory_id") inventory_id: number): Promise<Inventory | undefined> {
    const inventoryController = new InventoryController(new InventoryRepository(dataSource));
    return inventoryController.getInventory(inventory_id);
  }

  // Tạo một sản phẩm mới
  @Mutation(() => InventoryResponseDTO)
  async createInventory(@Arg("data") data: CreateInventoryInputDTO): Promise<Inventory> {
    const inventoryController = new InventoryController(new InventoryRepository(dataSource));
    return inventoryController.createInventory(data);
  }

  // Cập nhật một sản phẩm
  @Mutation(() => InventoryResponseDTO)
  async updateInventory(@Arg("data") data: UpdateInventoryInputDTO): Promise<Inventory> {
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
