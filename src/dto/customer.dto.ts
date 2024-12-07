import { Field, InputType, ObjectType } from "type-graphql";
import { IsEmail, IsOptional, IsPhoneNumber, Length } from "class-validator";

@InputType()
export class CreateCustomerInput {
  @Field()
  @Length(1, 255)
  name: string;

  @Field({ nullable: true })
  @IsEmail()
  @IsOptional()
  email?: string;

  @Field()
  @IsPhoneNumber("VI")
  phone: string;
}

@InputType()
export class UpdateCustomerInput {
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
  @IsPhoneNumber("VI")
  phone: string;
}

@ObjectType()
export class CustomerResponse {
  @Field()
  id: number;

  @Field()
  name: string;

  @Field({ nullable: true })
  email?: string;

  @Field()
  phone: string;

  constructor();
  constructor(id: number, name: string, phone: string, email?: string);

  constructor(id?: number, name?: string, phone?: string, email?: string) {
    if (id && name && phone) {
      this.id = id;
      this.name = name;
      this.phone = phone;
      this.email = email;
    } else {
      this.id = 0;
      this.name = "";
      this.phone = "";
      this.email = undefined;
    }
  }

  static createCustomerFromRawData(rawData: any) {
    return new CustomerResponse(
      rawData.customer_id,
      rawData.customer_email,
      rawData.customer_name,
      rawData.customer_phone
    );
  }
}
