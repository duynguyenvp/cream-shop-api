import { ObjectType } from "type-graphql";
import CategoryEntity from "../dto/categoryEntity";
import PaginatedResponse from "./PaginatedResponse";

@ObjectType()
export default class PaginatedCategories extends PaginatedResponse(CategoryEntity) {
}
