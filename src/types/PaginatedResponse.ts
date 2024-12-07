import { ClassType, Field, Int, ObjectType } from "type-graphql";

export default function PaginatedResponse<TItem extends object>(TItemClass: ClassType<TItem>) {
  @ObjectType()
  abstract class PaginatedResponseClass {
    @Field(() => Int)
    total!: number;
  
    @Field(() => Int)
    pageIndex!: number;
  
    @Field(() => Int)
    pageSize!: number;
  
    @Field(() => [TItemClass])
    data: TItem[];
  }
  return PaginatedResponseClass;
}