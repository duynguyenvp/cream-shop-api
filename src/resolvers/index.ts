import { NonEmptyArray } from "type-graphql";
import { AuthResolver } from "./authResolver";
import { CustomerResolver } from "./customerResolver";


const resolvers: NonEmptyArray<Function> = [AuthResolver, CustomerResolver];

export default resolvers;