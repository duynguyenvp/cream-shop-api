import { RecipeRepository } from "../db/repositories/recipeRepository";
import { RecipeController } from "../controllers/recipe.controller";
import dataSource from "../db/dataSource";
import { Recipe } from "../db/models/Recipe";
import { InventoryResponse } from "../dto/inventory.dto";
import { MenuItemResponse } from "../dto/menuItem.dto";
import {
  CreateRecipeInput,
  RecipeResponse,
  UpdateRecipeInput
} from "../dto/recipe.dto";
import {
  Resolver,
  Query,
  Mutation,
  Arg,
  FieldResolver,
  Root
} from "type-graphql";

@Resolver(() => RecipeResponse)
export class RecipeResolver {
  // Truy vấn tất cả công thức
  @Query(() => [RecipeResponse])
  async recipes(): Promise<Recipe[]> {
    const recipeController = new RecipeController(new RecipeRepository(dataSource));
    return recipeController.getAllRecipes();
  }

  // Truy vấn một công thức theo ID
  @Query(() => RecipeResponse, { nullable: true })
  async recipe(
    @Arg("recipe_id") recipe_id: number
  ): Promise<Recipe | undefined> {
    const recipeController = new RecipeController(new RecipeRepository(dataSource));
    return recipeController.getRecipe(recipe_id);
  }

  // Tạo công thức mới
  @Mutation(() => RecipeResponse)
  async createRecipe(@Arg("data") data: CreateRecipeInput): Promise<Recipe> {
    const recipeController = new RecipeController(new RecipeRepository(dataSource));
    return recipeController.createRecipe(data);
  }

  // Cập nhật công thức
  @Mutation(() => RecipeResponse)
  async updateRecipe(@Arg("data") data: UpdateRecipeInput): Promise<Recipe> {
    const recipeController = new RecipeController(new RecipeRepository(dataSource));
    return recipeController.updateRecipe(data);
  }

  // Xóa công thức
  @Mutation(() => Boolean)
  async deleteRecipe(@Arg("recipe_id") recipe_id: number): Promise<boolean> {
    const recipeController = new RecipeController(new RecipeRepository(dataSource));
    return recipeController.deleteRecipe(recipe_id);
  }

  // FieldResolver để lấy thông tin về MenuItem
  @FieldResolver(() => MenuItemResponse)
  async menuItem(@Root() recipe: Recipe): Promise<MenuItemResponse> {
    const recipeRepository = new RecipeRepository(dataSource);
    // Lấy thông tin MenuItem từ menuItemId trong Recipe
    const menuItem = await recipeRepository.menuItemRepository.getMenuItemById(
      recipe.menuItemId
    );
    return menuItem;
  }

  // FieldResolver để lấy thông tin về MenuItem
  @FieldResolver(() => InventoryResponse)
  async ingredient(@Root() recipe: Recipe): Promise<InventoryResponse> {
    const recipeRepository = new RecipeRepository(dataSource);
    // Lấy thông tin MenuItem từ menuItemId trong Recipe
    const ingredient = await recipeRepository.inventoryRepository.getInventoryById(
      recipe.ingredientId
    );
    return ingredient;
  }
}
