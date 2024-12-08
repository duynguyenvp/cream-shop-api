import { RecipeRepository } from "../db/repositories/recipeRepository";
import { RecipeController } from "../controllers/recipe.controller";
import dataSource from "../db/dataSource";
import { Recipe } from "../db/models/Recipe";
import { InventoryResponseDTO } from "../dto/inventory.dto";
import { MenuItemResponseDTO } from "../dto/menuItem.dto";
import {
  CreateRecipeInputDTO,
  RecipeResponseDTO,
  UpdateRecipeInputDTO
} from "../dto/recipe.dto";
import {
  Resolver,
  Query,
  Mutation,
  Arg,
  FieldResolver,
  Root
} from "type-graphql";

@Resolver(() => RecipeResponseDTO)
export class RecipeResolver {
  // Truy vấn tất cả công thức
  @Query(() => [RecipeResponseDTO])
  async recipes(): Promise<Recipe[]> {
    const recipeController = new RecipeController(new RecipeRepository(dataSource));
    return recipeController.getAllRecipes();
  }

  // Truy vấn một công thức theo ID
  @Query(() => RecipeResponseDTO, { nullable: true })
  async recipe(
    @Arg("recipe_id") recipe_id: number
  ): Promise<Recipe | undefined> {
    const recipeController = new RecipeController(new RecipeRepository(dataSource));
    return recipeController.getRecipe(recipe_id);
  }

  // Tạo công thức mới
  @Mutation(() => RecipeResponseDTO)
  async createRecipe(@Arg("data") data: CreateRecipeInputDTO): Promise<Recipe> {
    const recipeController = new RecipeController(new RecipeRepository(dataSource));
    return recipeController.createRecipe(data);
  }

  // Cập nhật công thức
  @Mutation(() => RecipeResponseDTO)
  async updateRecipe(@Arg("data") data: UpdateRecipeInputDTO): Promise<Recipe> {
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
  @FieldResolver(() => MenuItemResponseDTO)
  async menuItem(@Root() recipe: Recipe): Promise<MenuItemResponseDTO> {
    const recipeRepository = new RecipeRepository(dataSource);
    // Lấy thông tin MenuItem từ menuItemId trong Recipe
    const menuItem = await recipeRepository.menuItemRepository.getMenuItemById(
      recipe.menuItemId
    );
    return menuItem;
  }

  // FieldResolver để lấy thông tin về MenuItem
  @FieldResolver(() => InventoryResponseDTO)
  async ingredient(@Root() recipe: Recipe): Promise<InventoryResponseDTO> {
    const recipeRepository = new RecipeRepository(dataSource);
    // Lấy thông tin MenuItem từ menuItemId trong Recipe
    const ingredient = await recipeRepository.inventoryRepository.getInventoryById(
      recipe.ingredientId
    );
    return ingredient;
  }
}
