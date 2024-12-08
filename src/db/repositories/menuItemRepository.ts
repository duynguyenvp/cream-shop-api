import { DataSource, In, Repository } from "typeorm";
import { MenuItem } from "../models/MenuItem";
import PaginatedMenuItems from "../../dto/paginatedMenuItem.dto";
import { removeAccents } from "../../utils/removeAccents";

export class MenuItemRepository {
  private repository: Repository<MenuItem>;

  constructor(dataSource: DataSource) {
    this.repository = dataSource.getRepository(MenuItem);
  }

  // Thêm một món ăn mới
  async createMenuItem(
    name: string,
    price: number,
    description?: string
  ): Promise<MenuItem> {
    const menuItem = this.repository.create({
      name,
      description,
      price
    });
    return await this.repository.save(menuItem);
  }

  // Cập nhật thông tin món ăn
  async updateMenuItem(
    menuItemId: number,
    name: string,
    price: number,
    description?: string
  ): Promise<MenuItem> {
    const menuItem = await this.repository.findOne({
      where: { menu_item_id: menuItemId }
    });
    if (menuItem) {
      menuItem.name = name;
      menuItem.description = description;
      menuItem.price = price;
      return await this.repository.save(menuItem);
    }
    throw new Error("Menu item not found");
  }

  // Lấy tất cả món ăn
  async getAllMenuItems(
    pageIndex: number,
    pageSize: number,
    name: string
  ): Promise<PaginatedMenuItems> {
    const queryBuilder = this.repository.createQueryBuilder("menu_items");
    if (name) {
      queryBuilder
        .where("menu_items.search_vector @@ to_tsquery(:query)", {
          query: removeAccents(name).split(" ").join(" & ")
        });
    }
    queryBuilder.skip((pageIndex - 1) * pageSize).take(pageSize);
    const [menuitems, total] = await queryBuilder.getManyAndCount();
    return {
      pageIndex,
      pageSize,
      total,
      data: menuitems
    };
  }

  // Lấy một món ăn theo ID
  async getMenuItemById(menuItemId: number): Promise<MenuItem> {
    const menuItem = await this.repository.findOne({
      where: { menu_item_id: menuItemId }
    });
    if (!menuItem) {
      throw new Error("Menu item not found");
    }
    return menuItem;
  }

  // Lấy một món ăn theo IDs
  async getMenuItemByIds(menuItemIds: number[]): Promise<MenuItem[]> {
    const menuItem = await this.repository.find({
      where: { menu_item_id: In(menuItemIds) }
    });
    return menuItem;
  }

  // Xóa một món ăn
  async deleteMenuItem(menuItemId: number): Promise<MenuItem> {
    const menuItem = await this.repository.findOne({
      where: { menu_item_id: menuItemId }
    });
    if (!menuItem) {
      throw new Error("Menu item not found");
    }
    return await this.repository.remove(menuItem);
  }

  // Tìm kiếm món ăn theo tên
  async searchMenuItemByName(name: string): Promise<MenuItem[]> {
    return await this.repository.find({
      where: {
        name: name // Có thể thay đổi logic tìm kiếm nếu cần thiết
      }
    });
  }

  // Cập nhật giá món ăn
  async updatePrice(menuItemId: number, newPrice: number): Promise<MenuItem> {
    const menuItem = await this.repository.findOne({
      where: { menu_item_id: menuItemId }
    });
    if (!menuItem) {
      throw new Error("Menu item not found");
    }
    menuItem.price = newPrice;
    return await this.repository.save(menuItem);
  }
}
