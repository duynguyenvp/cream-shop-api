import PaginatedResponse from "../types/PaginatedResponse";
import { ObjectType } from "type-graphql";
import { InventoryResponseDTO } from "./inventory.dto";

@ObjectType()
export default class PaginatedInventories extends PaginatedResponse(InventoryResponseDTO) {
}
