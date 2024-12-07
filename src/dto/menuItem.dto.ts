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

  constructor();
  constructor(
    menu_item_id: number,
    name: string,
    description?: string,
    price?: number
  );

  constructor(
    menu_item_id?: number,
    name?: string,
    description?: string,
    price?: number
  ) {
    if (menu_item_id && name) {
      this.menu_item_id = menu_item_id;
      this.name = name;
      this.description = description;
      this.price = price;
    } else {
      this.menu_item_id = 0;
      this.name = "";
      this.description = undefined;
      this.price = undefined;
    }
  }

  static createMenuItemResponseFromRawData(rawData: any) {
    return new MenuItemResponse(
      rawData.menuitem_menu_item_id,
      rawData.menuitem_name,
      rawData.menuitem_description,
      rawData.menuitem_price
    );
  }
}
