import { MenuItem } from "../db/models/MenuItem";
import { UnitOfWork } from "../db/unitOfWork";
import { CreateMenuItemInput, UpdateMenuItemInput } from "../dto/menuItem.dto";

export class MenuItemController {
  private unitOfWork: UnitOfWork;

  constructor(uow?: UnitOfWork) {
    if (!uow) throw new Error("uow error");
    this.unitOfWork = uow;
  }

  // Tạo mới món ăn
  async createMenuItem(data: CreateMenuItemInput): Promise<MenuItem> {
    const { name, description, price } = data;
    const menuItem = this.unitOfWork.menuItemRepository.createMenuItem(
      name,
      description,
      price
    );
    return menuItem;
  }

  // Cập nhật món ăn
  async updateMenuItem(data: UpdateMenuItemInput): Promise<MenuItem> {
    const { menu_item_id, name, description, price } = data;    
    const menuItem = await this.unitOfWork.menuItemRepository.updateMenuItem(menu_item_id, name, description, price);
    return menuItem;
  }

  // Lấy tất cả các món ăn
  async getAllMenuItems(): Promise<MenuItem[]> {
    return this.unitOfWork.menuItemRepository.getAllMenuItems();
  }

  // Lấy một món ăn theo ID
  async getMenuItem(menu_item_id: number): Promise<MenuItem | undefined> {
    return this.unitOfWork.menuItemRepository.getMenuItemById(menu_item_id);
  }

  // Xóa món ăn
  async deleteMenuItem(menu_item_id: number): Promise<boolean> {
    const menuItem = await this.unitOfWork.menuItemRepository.deleteMenuItem(menu_item_id);
    if (!menuItem) {
      throw new Error("Menu item not found");
    }

    return true;
  }
}
