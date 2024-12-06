import "dotenv/config";

import { UnitOfWork } from "../db/unitOfWork";
import { Customer } from "../db/models/Customer";
import { CreateCustomerInput, UpdateCustomerInput } from "../dto/customer.dto";

export default class CustomerController {
  private unitOfWork: UnitOfWork;
  constructor(uow?: UnitOfWork) {
    if (!uow) throw new Error("uow error");
    this.unitOfWork = uow;
  }

  async customer(id: number): Promise<Customer> {
    const customer = await this.unitOfWork.customerRepository.getCustomerById(
      id
    );
    if (!customer) {
      throw new Error("Customer not found");
    }
    return customer;
  }

  async customers(): Promise<Customer[]> {
    return this.unitOfWork.customerRepository.getAllCustomers();
  }

  async createCustomer(data: CreateCustomerInput): Promise<Customer> {
    return this.unitOfWork.customerRepository.createCustomer(
      data.name,
      data.phone,
      data.email
    );
  }

  async updateCustomer(
    data: UpdateCustomerInput
  ): Promise<Customer> {
    return this.unitOfWork.customerRepository.updateCustomer(
      data.id,
      data.name,
      data.phone,
      data.email
    );
  }

  async deleteCustomer(id: number): Promise<boolean> {
    await this.unitOfWork.customerRepository.deleteCustomer(id);
    return true;
  }
}
