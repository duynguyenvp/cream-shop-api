import { InputType, Field, ObjectType } from "type-graphql";
import { IsEmail, MinLength } from "class-validator";
import UserDTO from "./user.dto";

@InputType()
export class RegisterInputDTO {
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
export class LoginInputDTO {
  @Field()
  @IsEmail()
  email: string;

  @Field()
  password: string;
}

@ObjectType()
export class LoginResponseDTO {
  @Field()
  token: string;

  @Field()
  refreshToken: string;

  @Field(() => UserDTO)
  user: UserDTO;
}
