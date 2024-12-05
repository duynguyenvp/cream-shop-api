import { NonEmptyArray } from "type-graphql";
import { AuthResolver } from "./authResolver";


const resolvers: NonEmptyArray<Function> = [AuthResolver];

export default resolvers;