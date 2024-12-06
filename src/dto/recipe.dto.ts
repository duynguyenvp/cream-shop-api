import { Field, InputType, ObjectType } from "type-graphql";
import { IsString, IsNumber, Min } from "class-validator";
import { MenuItemResponse } from "./menuItem.dto";
import { InventoryResponse } from "./inventory.dto";

@InputType()
export class CreateRecipeInput {
  @Field()
  @IsNumber()
  menuItemId: number;

  @Field()
  @IsNumber()
  ingredientId: number;

  @Field()
  @IsNumber()
  @Min(0)
  quantity: number;

  @Field()
  @IsString()
  unit: string;
}

@InputType()
export class UpdateRecipeInput {
  @Field()
  recipe_id: number;

  @Field()
  @IsNumber()
  menuItemId: number;

  @Field()
  @IsNumber()
  ingredientId: number;

  @Field()
  @IsNumber()
  @Min(0)
  quantity: number;

  @Field()
  @IsString()
  unit: string;
}

@ObjectType()
export class RecipeResponse {
  @Field()
  recipe_id: number;

  @Field(() => MenuItemResponse)
  menuItem: MenuItemResponse;

  @Field(() => InventoryResponse)
  ingredient: InventoryResponse;

  @Field()
  quantity: number;

  @Field()
  unit: string;
}
