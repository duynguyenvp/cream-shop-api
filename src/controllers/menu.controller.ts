import { MenuItemRepository } from "../db/repositories/menuItemRepository";
import { MenuItem } from "../db/models/MenuItem";
import { CreateMenuItemInput, UpdateMenuItemInput } from "../dto/menuItem.dto";

export class MenuItemController {
  private menuItemRepository: MenuItemRepository;

  constructor(menuItemRepository: MenuItemRepository) {
    this.menuItemRepository = menuItemRepository;
  }

  // Tạo mới món ăn
  async createMenuItem(data: CreateMenuItemInput): Promise<MenuItem> {
    const { name, description, price } = data;
    const menuItem = this.menuItemRepository.createMenuItem(
      name,
      price,
      description
    );
    return menuItem;
  }

  // Cập nhật món ăn
  async updateMenuItem(data: UpdateMenuItemInput): Promise<MenuItem> {
    const { menu_item_id, name, description, price } = data;    
    const menuItem = await this.menuItemRepository.updateMenuItem(menu_item_id, name, price, description);
    return menuItem;
  }

  // Lấy tất cả các món ăn
  async getAllMenuItems(): Promise<MenuItem[]> {
    return this.menuItemRepository.getAllMenuItems();
  }

  // Lấy một món ăn theo ID
  async getMenuItem(menu_item_id: number): Promise<MenuItem | undefined> {
    return this.menuItemRepository.getMenuItemById(menu_item_id);
  }

  // Xóa món ăn
  async deleteMenuItem(menu_item_id: number): Promise<boolean> {
    const menuItem = await this.menuItemRepository.deleteMenuItem(menu_item_id);
    if (!menuItem) {
      throw new Error("Menu item not found");
    }

    return true;
  }
}
