import {  Repository } from 'typeorm';
import { MenuItem } from '../models/MenuItem';

export class MenuItemRepository {
  private repository: Repository<MenuItem>;

  constructor(_repository: Repository<MenuItem>) {
    this.repository = _repository;
  }

  // Thêm một món ăn mới
  async createMenuItem(name: string, description?: string, price?: number): Promise<MenuItem> {
    const menuItem = this.repository.create({
      name,
      description,
      price,
    });
    return await this.repository.save(menuItem);
  }

  // Cập nhật thông tin món ăn
  async updateMenuItem(menuItemId: number, name: string, description?: string, price?: number): Promise<MenuItem> {
    const menuItem = await this.repository.findOne({ where: { menu_item_id: menuItemId } });
    if (menuItem) {
      menuItem.name = name;
      menuItem.description = description;
      menuItem.price = price;
      return await this.repository.save(menuItem);
    }
    throw new Error('Menu item not found');
  }

  // Lấy tất cả món ăn
  async getAllMenuItems(): Promise<MenuItem[]> {
    return await this.repository.find();
  }

  // Lấy một món ăn theo ID
  async getMenuItemById(menuItemId: number): Promise<MenuItem> {
    const menuItem = await this.repository.findOne({ where: { menu_item_id: menuItemId } });
    if (!menuItem) {
      throw new Error('Menu item not found');
    }
    return menuItem;
  }

  // Xóa một món ăn
  async deleteMenuItem(menuItemId: number): Promise<MenuItem> {
    const menuItem = await this.repository.findOne({ where: { menu_item_id: menuItemId } });
    if (!menuItem) {
      throw new Error('Menu item not found');
    }
    return await this.repository.remove(menuItem);
  }

  // Tìm kiếm món ăn theo tên
  async searchMenuItemByName(name: string): Promise<MenuItem[]> {
    return await this.repository.find({
      where: {
        name: name, // Có thể thay đổi logic tìm kiếm nếu cần thiết
      },
    });
  }

  // Cập nhật giá món ăn
  async updatePrice(menuItemId: number, newPrice: number): Promise<MenuItem> {
    const menuItem = await this.repository.findOne({ where: { menu_item_id: menuItemId } });
    if (!menuItem) {
      throw new Error('Menu item not found');
    }
    menuItem.price = newPrice;
    return await this.repository.save(menuItem);
  }
}
