import { NonEmptyArray } from "type-graphql";
import { AuthResolver } from "./authResolver";
import { CustomerResolver } from "./customerResolver";
import { InventoryResolver } from "./inventoryResolver";
import { MenuItemResolver } from "./menuResolver";

const resolvers: NonEmptyArray<Function> = [
  AuthResolver,
  CustomerResolver,
  InventoryResolver,
  MenuItemResolver
];

export default resolvers;
