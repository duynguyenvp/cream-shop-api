import { MenuItemRepository } from "../db/repositories/menuItemRepository";
import { MenuItemController } from "../controllers/menu.controller";
import dataSource from "../db/dataSource";
import { MenuItem } from "../db/models/MenuItem";
import { CreateMenuItemInputDTO, MenuItemResponseDTO, UpdateMenuItemInputDTO } from "../dto/menuItem.dto";
import { Resolver, Query, Mutation, Arg } from "type-graphql";
import PaginatedMenuItems from "../dto/paginatedMenuItem.dto";

@Resolver()
export class MenuItemResolver {
  @Query(() => PaginatedMenuItems)
  async menuItems(
    @Arg("pageIndex") pageIndex: number,
    @Arg("pageSize") pageSize: number,
    @Arg("name", { nullable: true }) name: string
  ): Promise<PaginatedMenuItems> {
    const menuItemController = new MenuItemController(
      new MenuItemRepository(dataSource)
    );
    return menuItemController.getAllMenuItems(
      pageIndex,
      pageSize,
      name
    );
  }

  // Truy vấn một món ăn theo ID
  @Query(() => MenuItemResponseDTO, { nullable: true })
  async menuItem(
    @Arg("menu_item_id") menu_item_id: number
  ): Promise<MenuItem | undefined> {
    const menuItemController = new MenuItemController(
      new MenuItemRepository(dataSource)
    );
    return menuItemController.getMenuItem(menu_item_id);
  }

  // Tạo một món ăn mới
  @Mutation(() => MenuItemResponseDTO)
  async createMenuItem(
    @Arg("data") data: CreateMenuItemInputDTO
  ): Promise<MenuItem> {
    const menuItemController = new MenuItemController(
      new MenuItemRepository(dataSource)
    );
    return menuItemController.createMenuItem(data);
  }

  // Cập nhật một món ăn
  @Mutation(() => MenuItemResponseDTO)
  async updateMenuItem(
    @Arg("data") data: UpdateMenuItemInputDTO
  ): Promise<MenuItem> {
    const menuItemController = new MenuItemController(
      new MenuItemRepository(dataSource)
    );
    return menuItemController.updateMenuItem(data);
  }

  // Xóa một món ăn
  @Mutation(() => Boolean)
  async deleteMenuItem(
    @Arg("menu_item_id") menu_item_id: number
  ): Promise<boolean> {
    const menuItemController = new MenuItemController(
      new MenuItemRepository(dataSource)
    );
    return menuItemController.deleteMenuItem(menu_item_id);
  }
}
