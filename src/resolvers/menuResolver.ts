import { MenuItemRepository } from "../db/repositories/menuItemRepository";
import { MenuItemController } from "../controllers/menu.controller";
import dataSource from "../db/dataSource";
import { MenuItem } from "../db/models/MenuItem";
import { CreateMenuItemInput, MenuItemResponse, UpdateMenuItemInput } from "../dto/menuItem.dto";
import { Resolver, Query, Mutation, Arg } from "type-graphql";

@Resolver()
export class MenuItemResolver {
  // Truy vấn tất cả món ăn
  @Query(() => [MenuItemResponse])
  async menuItems(): Promise<MenuItem[]> {
    const menuItemController = new MenuItemController(
      new MenuItemRepository(dataSource)
    );
    return menuItemController.getAllMenuItems();
  }

  // Truy vấn một món ăn theo ID
  @Query(() => MenuItemResponse, { nullable: true })
  async menuItem(
    @Arg("menu_item_id") menu_item_id: number
  ): Promise<MenuItem | undefined> {
    const menuItemController = new MenuItemController(
      new MenuItemRepository(dataSource)
    );
    return menuItemController.getMenuItem(menu_item_id);
  }

  // Tạo một món ăn mới
  @Mutation(() => MenuItemResponse)
  async createMenuItem(
    @Arg("data") data: CreateMenuItemInput
  ): Promise<MenuItem> {
    const menuItemController = new MenuItemController(
      new MenuItemRepository(dataSource)
    );
    return menuItemController.createMenuItem(data);
  }

  // Cập nhật một món ăn
  @Mutation(() => MenuItemResponse)
  async updateMenuItem(
    @Arg("data") data: UpdateMenuItemInput
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
