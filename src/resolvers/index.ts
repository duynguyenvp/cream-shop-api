import { NonEmptyArray } from "type-graphql";
import { AuthResolver } from "./authResolver";
import { CustomerResolver } from "./customerResolver";
import { InventoryResolver } from "./inventoryResolver";
import { MenuItemResolver } from "./menuResolver";
import { RecipeResolver } from "./recipeResolver";

const resolvers: NonEmptyArray<Function> = [
  AuthResolver,
  CustomerResolver,
  InventoryResolver,
  MenuItemResolver,
  RecipeResolver
];

export default resolvers;
