import PaginatedResponse from "../types/PaginatedResponse";
import { ObjectType } from "type-graphql";
import { MenuItemResponseDTO } from "./menuItem.dto";

@ObjectType()
export default class PaginatedMenuItems extends PaginatedResponse(MenuItemResponseDTO) {
}
