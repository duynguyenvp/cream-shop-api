import { Repository } from "typeorm";
import { Recipe } from "../models/Recipe";
import { MenuItemRepository } from "./menuItemRepository";
import { InventoryRepository } from "./InventoryRepository";

export class RecipeRepository {
  private repository: Repository<Recipe>;
  private menuItemRepository: MenuItemRepository;
  private inventoryRepository: InventoryRepository;

  constructor(
    _repository: Repository<Recipe>,
    _menuItemRepository: MenuItemRepository,
    _inventoryRepository: InventoryRepository
  ) {
    this.repository = _repository;
    this.menuItemRepository = _menuItemRepository;
    this.inventoryRepository = _inventoryRepository;
  }

  // Kiểm tra xem khách hàng có tồn tại không
  private async checkMenuItemExists(id: number): Promise<boolean> {
    const menu = await this.menuItemRepository.getMenuItemById(id);
    return !!menu; // Trả về true nếu khách hàng tồn tại, false nếu không
  }

  private async checkIngredientExists(id: number): Promise<boolean> {
    const ingredient = await this.inventoryRepository.getInventoryById(id);
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
    const loyaltyPoint = this.repository.create({
      menuItemId: menuId,
      ingredientId: ingredientId,
      quantity,
      unit
    });

    return await this.repository.save(loyaltyPoint);
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
    const recipe = await this.repository.findOne({
      where: { recipe_id: id }
    });
    if (recipe) {
      recipe.quantity = quantity;
      recipe.unit = unit;
      recipe.ingredientId = ingredientId;
      recipe.menuItemId = menuId;
      return await this.repository.save(recipe);
    }

    throw new Error("Recipe not found");
  }

  // Lấy tất cả điểm thưởng
  async getAllRecipes(): Promise<Recipe[]> {
    return await this.repository.find();
  }

  // Lấy điểm thưởng theo ID
  async getRecipeById(loyaltyPointId: number): Promise<Recipe> {
    const loyaltyPoint = await this.repository.findOne({
      where: { recipe_id: loyaltyPointId }
    });
    if (!loyaltyPoint) {
      throw new Error("Recipe not found");
    }
    return loyaltyPoint;
  }

  // Xóa điểm thưởng của khách hàng
  async deleteRecipe(loyaltyPointId: number): Promise<Recipe> {
    const loyaltyPoint = await this.repository.findOne({
      where: { recipe_id: loyaltyPointId }
    });
    if (!loyaltyPoint) {
      throw new Error("Recipe not found");
    }
    return await this.repository.remove(loyaltyPoint);
  }
}
