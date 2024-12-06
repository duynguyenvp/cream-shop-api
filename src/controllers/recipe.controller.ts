import { Recipe } from "../db/models/Recipe";
import { UnitOfWork } from "../db/unitOfWork";
import { CreateRecipeInput, UpdateRecipeInput } from "../dto/recipe.dto";

export class RecipeController {
  private unitOfWork: UnitOfWork;

  constructor(uow?: UnitOfWork) {
    if (!uow) throw new Error("uow error");
    this.unitOfWork = uow;
  }

  // Tạo mới công thức
  async createRecipe(data: CreateRecipeInput): Promise<Recipe> {
    const { menuItemId, ingredientId, quantity, unit } = data;
    const recipe = this.unitOfWork.recipeRepository.createRecipe(menuItemId, ingredientId, quantity, unit );
    return recipe;
  }

  // Cập nhật công thức
  async updateRecipe(data: UpdateRecipeInput): Promise<Recipe> {
    const { recipe_id, menuItemId, ingredientId, quantity, unit } = data;
    const recipe = await this.unitOfWork.recipeRepository.updateRecipe(recipe_id, menuItemId, ingredientId, quantity, unit);
    return recipe;
  }

  // Lấy tất cả công thức
  async getAllRecipes(): Promise<Recipe[]> {
    return this.unitOfWork.recipeRepository.getAllRecipes();
  }

  // Lấy một công thức theo ID
  async getRecipe(recipe_id: number): Promise<Recipe | undefined> {
    return this.unitOfWork.recipeRepository.getRecipeById(recipe_id);
  }

  // Xóa công thức
  async deleteRecipe(recipe_id: number): Promise<boolean> {
    const recipe = await this.unitOfWork.recipeRepository.deleteRecipe(recipe_id);
    if (!recipe) {
      throw new Error("Recipe not found");
    }

    return true;
  }
}
