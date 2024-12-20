import { IsEmail, IsOptional, IsPhoneNumber, Length } from "class-validator";
import { Field, ID, InputType, ObjectType } from "type-graphql";

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

  constructor();
  constructor(
    id: number,
    name: string,
    email: string,
    role: string,
    phone?: string
  );

  constructor(
    id?: number,
    name?: string,
    email?: string,
    role?: string,
    phone?: string
  ) {
    if (id && name && email && role) {
      this.id = id;
      this.name = name;
      this.email = email;
      this.role = role;
      this.phone = phone;
    } else {
      this.id = 0;
      this.name = "";
      this.email = "";
      this.role = "";
      this.phone = undefined;
    }
  }

  static createUserFromRawData(rawData: any) {
    return new UserDTO(
      rawData.employee_id,
      rawData.employee_name,
      rawData.employee_email,
      rawData.employee_role,
      rawData.employee_phone
    );
  }
}

@InputType()
export class UpdateUserInputDTO {
  @Field()
  id: number;

  @Field()
  @Length(1, 255)
  name: string;

  @Field({ nullable: true })
  @IsEmail()
  @IsOptional()
  email?: string;
  
  @Field({ nullable: true })
  @IsOptional()
  @IsPhoneNumber("VI")
  phone?: string;
}

export type UserSimpleDTO = {
  id?: number,
  email?: string,
  role?: string,
}