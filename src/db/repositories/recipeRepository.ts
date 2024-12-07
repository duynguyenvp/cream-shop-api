import { DataSource, Repository } from "typeorm";
import { Recipe } from "../models/Recipe";
import { MenuItemRepository } from "./menuItemRepository";
import { InventoryRepository } from "./InventoryRepository";

export class RecipeRepository {
  private _repository: Repository<Recipe>;
  private _menuItemRepository: MenuItemRepository;
  private _inventoryRepository: InventoryRepository;

  constructor(dataSource: DataSource) {
    this._repository = dataSource.getRepository(Recipe);
    this._menuItemRepository = new MenuItemRepository(dataSource);
    this._inventoryRepository = new InventoryRepository(dataSource);
  }

  // Kiểm tra xem khách hàng có tồn tại không
  private async checkMenuItemExists(id: number): Promise<boolean> {
    const menu = await this._menuItemRepository.getMenuItemById(id);
    return !!menu; // Trả về true nếu khách hàng tồn tại, false nếu không
  }

  private async checkIngredientExists(id: number): Promise<boolean> {
    const ingredient = await this._inventoryRepository.getInventoryById(id);
    return !!ingredient; // Trả về true nếu khách hàng tồn tại, false nếu không
  }

  // Thêm một điểm thưởng cho khách hàng
  async createRecipe(
    menuId: number,
    ingredientId: number,
    quantity: number,
    unit: string
  ): Promise<Recipe> {
    // Kiểm tra xem khách hàng có tồn tại hay không
    const menuItemExists = await this.checkMenuItemExists(menuId);
    if (!menuItemExists) {
      throw new Error("Menu Item not found");
    }
    const ingredientExists = await this.checkIngredientExists(ingredientId);
    if (!ingredientExists) {
      throw new Error("Ingredient not found");
    }

    // Tạo điểm thưởng và lưu vào cơ sở dữ liệu
    const loyaltyPoint = this._repository.create({
      menuItemId: menuId,
      ingredientId: ingredientId,
      quantity,
      unit
    });

    return await this._repository.save(loyaltyPoint);
  }

  // Cập nhật điểm thưởng của khách hàng
  async updateRecipe(
    id: number,
    menuId: number,
    ingredientId: number,
    quantity: number,
    unit: string
  ): Promise<Recipe> {
    const menuItemExists = await this.checkMenuItemExists(menuId);
    if (!menuItemExists) {
      throw new Error("Menu Item not found");
    }
    const ingredientExists = await this.checkIngredientExists(ingredientId);
    if (!ingredientExists) {
      throw new Error("Ingredient not found");
    }
    const recipe = await this._repository.findOne({
      where: { recipe_id: id }
    });
    if (recipe) {
      recipe.quantity = quantity;
      recipe.unit = unit;
      recipe.ingredientId = ingredientId;
      recipe.menuItemId = menuId;
      return await this._repository.save(recipe);
    }

    throw new Error("Recipe not found");
  }

  // Lấy tất cả điểm thưởng
  async getAllRecipes(): Promise<Recipe[]> {
    return await this._repository.find();
  }
  
  get menuItemRepository(): MenuItemRepository {
    return this._menuItemRepository;
  }

  get inventoryRepository(): InventoryRepository {
    return this._inventoryRepository;
  }

  // Lấy điểm thưởng theo ID
  async getRecipeById(loyaltyPointId: number): Promise<Recipe> {
    const loyaltyPoint = await this._repository.findOne({
      where: { recipe_id: loyaltyPointId }
    });
    if (!loyaltyPoint) {
      throw new Error("Recipe not found");
    }
    return loyaltyPoint;
  }

  // Xóa điểm thưởng của khách hàng
  async deleteRecipe(loyaltyPointId: number): Promise<Recipe> {
    const loyaltyPoint = await this._repository.findOne({
      where: { recipe_id: loyaltyPointId }
    });
    if (!loyaltyPoint) {
      throw new Error("Recipe not found");
    }
    return await this._repository.remove(loyaltyPoint);
  }
}
