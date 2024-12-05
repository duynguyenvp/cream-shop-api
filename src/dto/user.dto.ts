import { Field, ID, ObjectType } from "type-graphql";

@ObjectType()
export default class UserDTO {
  @Field(() => ID)
  id: number;
  @Field()
  name: string;
  @Field()
  email: string;
  @Field()
  role: string;
  @Field({ nullable: true })
  phone?: string;
}
