import { Field, InputType, ObjectType } from "type-graphql";
import { IsString, IsNumber, Min } from "class-validator";

@InputType()
export class CreateInventoryInput {
  @Field()
  @IsString()
  name: string;

  @Field()
  @IsNumber()
  price: number;

  @Field()
  @IsNumber()
  @Min(0)
  in_stock: number;
}

@InputType()
export class UpdateInventoryInput {
  @Field()
  inventory_id: number;

  @Field()
  @IsString()
  name: string;

  @Field()
  @IsNumber()
  price: number;

  @Field()
  @IsNumber()
  @Min(0)
  in_stock: number;
}

@ObjectType()
export class InventoryResponse {
  @Field()
  inventory_id: number;

  @Field()
  name: string;

  @Field()
  price: number;

  @Field()
  in_stock: number;
}
