import { Resolver, Query, Mutation, Arg } from "type-graphql";
import { Customer } from "../db/models/Customer";
import {
  CreateCustomerInput,
  CustomerResponse,
  UpdateCustomerInput
} from "../dto/customer.dto";
import CustomerController from "../controllers/customer.controller";
import { UnitOfWork } from "../db/unitOfWork";
import dataSource from "../db/dataSource";

@Resolver()
export class CustomerResolver {
  @Query(() => CustomerResponse)
  async customer(@Arg("id") id: number): Promise<Customer> {
    const authController = new CustomerController(new UnitOfWork(dataSource));
    const customer = await authController.customer(id);
    return customer;
  }

  @Query(() => [CustomerResponse])
  async customers(): Promise<Customer[]> {
    const authController = new CustomerController(new UnitOfWork(dataSource));
    return authController.customers();
  }

  @Mutation(() => CustomerResponse)
  async createCustomer(
    @Arg("data") data: CreateCustomerInput
  ): Promise<Customer> {
    const authController = new CustomerController(new UnitOfWork(dataSource));
    return authController.createCustomer(data);
  }

  @Mutation(() => CustomerResponse)
  async updateCustomer(
    @Arg("data") data: UpdateCustomerInput
  ): Promise<Customer> {
    const authController = new CustomerController(new UnitOfWork(dataSource));
    return authController.updateCustomer(data);
  }

  @Mutation(() => Boolean)
  async deleteCustomer(@Arg("id") id: number): Promise<boolean> {
    const authController = new CustomerController(new UnitOfWork(dataSource));
    return authController.deleteCustomer(id);
  }
}
