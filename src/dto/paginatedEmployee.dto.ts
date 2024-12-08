import PaginatedResponse from "../types/PaginatedResponse";
import { ObjectType } from "type-graphql";
import UserDTO from "./user.dto";

@ObjectType()
export default class PaginatedEmployees extends PaginatedResponse(UserDTO) {
}
