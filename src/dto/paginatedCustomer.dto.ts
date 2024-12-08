import PaginatedResponse from "../types/PaginatedResponse";
import { ObjectType } from "type-graphql";
import { CustomerResponseDTO } from "./customer.dto";

@ObjectType()
export default class PaginatedCustomers extends PaginatedResponse(CustomerResponseDTO) {
}
