import { RecipeRepository } from "../db/repositories/recipeRepository";
import { Recipe } from "../db/models/Recipe";
import { CreateRecipeInput, UpdateRecipeInput } from "../dto/recipe.dto";

export class RecipeController {
  private recipeRepository: RecipeRepository;

  constructor(_recipeRepository: RecipeRepository) {
    this.recipeRepository = _recipeRepository;
  }

  // Tạo mới công thức
  async createRecipe(data: CreateRecipeInput): Promise<Recipe> {
    const { menuItemId, ingredientId, quantity, unit } = data;
    const recipe = this.recipeRepository.createRecipe(menuItemId, ingredientId, quantity, unit );
    return recipe;
  }

  // Cập nhật công thức
  async updateRecipe(data: UpdateRecipeInput): Promise<Recipe> {
    const { recipe_id, menuItemId, ingredientId, quantity, unit } = data;
    const recipe = await this.recipeRepository.updateRecipe(recipe_id, menuItemId, ingredientId, quantity, unit);
    return recipe;
  }

  // Lấy tất cả công thức
  async getAllRecipes(): Promise<Recipe[]> {
    return this.recipeRepository.getAllRecipes();
  }

  // Lấy một công thức theo ID
  async getRecipe(recipe_id: number): Promise<Recipe | undefined> {
    return this.recipeRepository.getRecipeById(recipe_id);
  }

  // Xóa công thức
  async deleteRecipe(recipe_id: number): Promise<boolean> {
    const recipe = await this.recipeRepository.deleteRecipe(recipe_id);
    if (!recipe) {
      throw new Error("Recipe not found");
    }

    return true;
  }
}
