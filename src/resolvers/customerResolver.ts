import { Resolver, Query, Mutation, Arg } from "type-graphql";
import { Customer } from "../db/models/Customer";
import {
  CreateCustomerInputDTO,
  CustomerResponseDTO,
  UpdateCustomerInputDTO
} from "../dto/customer.dto";
import CustomerController from "../controllers/customer.controller";
import dataSource from "../db/dataSource";
import { CustomerRepository } from "../db/repositories/customerRepository";
import PaginatedCustomers from "../dto/paginatedCustomer.dto";

@Resolver()
export class CustomerResolver {
  @Query(() => CustomerResponseDTO)
  async customer(@Arg("id") id: number): Promise<Customer> {
    const authController = new CustomerController(
      new CustomerRepository(dataSource)
    );
    const customer = await authController.customer(id);
    return customer;
  }

  @Query(() => PaginatedCustomers)
  async customers(
    @Arg("pageIndex") pageIndex: number,
    @Arg("pageSize") pageSize: number,
    @Arg("phone", { nullable: true }) phone: string,
    @Arg("name", { nullable: true }) name: string
  ): Promise<PaginatedCustomers> {
    const authController = new CustomerController(
      new CustomerRepository(dataSource)
    );
    return authController.customers(pageIndex, pageSize, phone, name);
  }

  @Mutation(() => CustomerResponseDTO)
  async createCustomer(
    @Arg("data") data: CreateCustomerInputDTO
  ): Promise<Customer> {
    const authController = new CustomerController(
      new CustomerRepository(dataSource)
    );
    return authController.createCustomer(data);
  }

  @Mutation(() => CustomerResponseDTO)
  async updateCustomer(
    @Arg("data") data: UpdateCustomerInputDTO
  ): Promise<Customer> {
    const authController = new CustomerController(
      new CustomerRepository(dataSource)
    );
    return authController.updateCustomer(data);
  }

  @Mutation(() => Boolean)
  async deleteCustomer(@Arg("id") id: number): Promise<boolean> {
    const authController = new CustomerController(
      new CustomerRepository(dataSource)
    );
    return authController.deleteCustomer(id);
  }
}
