import { InputType, Field, ObjectType } from "type-graphql";
import { IsEmail, MinLength } from "class-validator";
import UserDto from "./userDto";

@InputType()
export class RegisterInput {
  @Field()
  name: string;

  @Field()
  @IsEmail()
  email: string;

  @Field({ nullable: true })
  phone_number: string;

  @Field()
  @MinLength(6)
  password: string;
}

@InputType()
export class LoginInput {
  @Field()
  @IsEmail()
  email: string;

  @Field()
  password: string;
}

@ObjectType()
export class LoginResponse {
  @Field()
  token: string;

  @Field()
  refreshToken: string;

  @Field(() => UserDto)
  user: UserDto;
}
