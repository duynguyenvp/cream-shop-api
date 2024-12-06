import { NonEmptyArray } from "type-graphql";
import { AuthResolver } from "./authResolver";
import { CustomerResolver } from "./customerResolver";
import { InventoryResolver } from "./inventoryResolver";
import { MenuItemResolver } from "./menuResolver";
import { RecipeResolver } from "./recipeResolver";
import { OrderResolver } from "./orderResolver";

const resolvers: NonEmptyArray<Function> = [
  AuthResolver,
  CustomerResolver,
  InventoryResolver,
  MenuItemResolver,
  RecipeResolver,
  OrderResolver
];

export default resolvers;
