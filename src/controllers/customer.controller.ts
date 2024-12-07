import "dotenv/config";

import { Customer } from "../db/models/Customer";
import { CreateCustomerInput, UpdateCustomerInput } from "../dto/customer.dto";
import { CustomerRepository } from "../db/repositories/customerRepository";

export default class CustomerController {
  private customerRepository: CustomerRepository;
  constructor(customerRepository: CustomerRepository) {
    this.customerRepository = customerRepository;
  }

  async customer(id: number): Promise<Customer> {
    const customer = await this.customerRepository.getCustomerById(
      id
    );
    if (!customer) {
      throw new Error("Customer not found");
    }
    return customer;
  }

  async customers(): Promise<Customer[]> {
    return this.customerRepository.getAllCustomers();
  }

  async createCustomer(data: CreateCustomerInput): Promise<Customer> {
    return this.customerRepository.createCustomer(
      data.name,
      data.phone,
      data.email
    );
  }

  async updateCustomer(
    data: UpdateCustomerInput
  ): Promise<Customer> {
    return this.customerRepository.updateCustomer(
      data.id,
      data.name,
      data.phone,
      data.email
    );
  }

  async deleteCustomer(id: number): Promise<boolean> {
    await this.customerRepository.deleteCustomer(id);
    return true;
  }
}
