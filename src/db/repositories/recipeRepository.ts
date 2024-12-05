import { CreateRecipeDTO } from "src/dto/createRecipe.dto";
import { Inventory } from "../models/Inventory";
import { MenuItem } from "../models/MenuItem";
import { Recipe } from "../models/Recipe";
import { Repository } from "typeorm";

class RecipeRepository {
  private _recipeRepository: Repository<Recipe>;
  private _menuItemRepository: Repository<MenuItem>;
  private _inventoryRepository: Repository<Inventory>;

  constructor(
    recipeRepository: Repository<Recipe>,
    menuItemRepository: Repository<MenuItem>,
    inventoryRepository: Repository<Inventory>
  ) {
    this._recipeRepository = recipeRepository;
    this._inventoryRepository = inventoryRepository;
    this._menuItemRepository = menuItemRepository;
  }

  async findById(recipeId: number) {
    const recipe = await this._recipeRepository.findOne({
      where: { recipe_id: recipeId },
      relations: ["menuItem", "ingredient"]
    });

    if (!recipe) {
      throw new Error(`Recipe with id ${recipeId} not found`);
    }

    return recipe;
  }

  async findAll() {
    const recipes = await this._recipeRepository.find({
      relations: ["menuItem", "ingredient"]
    });

    return recipes;
  }

  async createRecipe(createRecipeDTO: CreateRecipeDTO) {
    const menuItem = await this._menuItemRepository.findOneBy({
      menu_item_id: createRecipeDTO.menuItemId
    });
    const ingredient = await this._inventoryRepository.findOneBy({
      inventory_id: createRecipeDTO.ingredientId
    });

    if (!menuItem) {
      throw new Error(
        `MenuItem with id ${createRecipeDTO.menuItemId} not found`
      );
    }

    if (!ingredient) {
      throw new Error(
        `Ingredient with id ${createRecipeDTO.ingredientId} not found`
      );
    }

    const recipe = this._recipeRepository.create({
      menuItem,
      ingredient,
      quantity: createRecipeDTO.quantity,
      unit: createRecipeDTO.unit
    });

    await this._recipeRepository.save(recipe);
    return recipe;
  }

  async updateRecipe(recipeId: number, updateData: Partial<Recipe>) {
    const recipe = await this.findById(recipeId);

    const updatedRecipe = Object.assign(recipe, updateData);

    await this._recipeRepository.save(updatedRecipe);
    return updatedRecipe;
  }

  async deleteRecipe(recipeId: number) {
    const recipe = await this.findById(recipeId);

    await this._recipeRepository.remove(recipe);
  }
}

export default RecipeRepository;
