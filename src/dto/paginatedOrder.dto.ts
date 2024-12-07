import PaginatedResponse from "../types/PaginatedResponse";
import { ObjectType } from "type-graphql";
import { OrderResponseDTO } from "./order.dto";

@ObjectType()
export default class PaginatedOrders extends PaginatedResponse(OrderResponseDTO) {
}
