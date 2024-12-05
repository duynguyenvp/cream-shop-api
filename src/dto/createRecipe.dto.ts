// dtos/createRecipe.dto.ts
import { IsNumber, IsString, IsNotEmpty } from "class-validator";

export class CreateRecipeDTO {
  @IsNumber()
  menuItemId: number;

  @IsNumber()
  ingredientId: number;

  @IsNumber()
  quantity: number;

  @IsString()
  @IsNotEmpty()
  unit: string;
}
