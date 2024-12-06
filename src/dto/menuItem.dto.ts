import { Field, InputType, ObjectType } from "type-graphql";
import { IsString, IsOptional, IsNumber, Min } from "class-validator";

@InputType()
export class CreateMenuItemInput {
  @Field()
  @IsString()
  name: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  description?: string;

  @Field()
  @IsNumber()
  @Min(0)
  price: number;
}

@InputType()
export class UpdateMenuItemInput {
  @Field()
  menu_item_id: number;

  @Field()
  @IsString()
  name: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  description?: string;

  @Field()
  @IsNumber()
  @Min(0)
  price: number;
}

@ObjectType()
export class MenuItemResponse {
  @Field()
  menu_item_id: number;

  @Field()
  name: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  price?: number;
}