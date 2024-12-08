import { Field, InputType, ObjectType } from "type-graphql";
import { IsString, IsNumber, Min } from "class-validator";
import { MenuItemResponseDTO } from "./menuItem.dto";
import { InventoryResponseDTO } from "./inventory.dto";

@InputType()
export class CreateRecipeInputDTO {
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
export class UpdateRecipeInputDTO {
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
export class RecipeResponseDTO {
  @Field()
  recipe_id: number;

  @Field(() => MenuItemResponseDTO)
  menuItem: MenuItemResponseDTO;

  @Field(() => InventoryResponseDTO)
  ingredient: InventoryResponseDTO;

  @Field()
  quantity: number;

  @Field()
  unit: string;
}
