import { DataSource, Repository } from "typeorm";
import { Customer } from "../models/Customer";
import PaginatedCustomers from "../../dto/paginatedCustomer.dto";

export class CustomerRepository {
  private repository: Repository<Customer>;

  constructor(dataSource: DataSource) {
    this.repository = dataSource.getRepository(Customer);
  }

  // Thêm một khách hàng mới
  async createCustomer(
    name: string,
    phone: string,
    email?: string
  ): Promise<Customer> {
    const customer = this.repository.create({
      name,
      email,
      phone
    });
    return await this.repository.save(customer);
  }

  // Cập nhật thông tin khách hàng
  async updateCustomer(
    customerId: number,
    name: string,
    phone: string,
    email?: string
  ): Promise<Customer> {
    const customer = await this.repository.findOne({
      where: { id: customerId }
    });
    if (customer) {
      customer.name = name;
      customer.email = email ? email : customer.email;
      customer.phone = phone ? phone : customer.phone;
      return await this.repository.save(customer);
    }
    throw new Error("Customer not found");
  }

  // Lấy tất cả khách hàng
  async getAllCustomers(
    pageIndex: number,
    pageSize: number,
    phone: string,
    name: string
  ): Promise<PaginatedCustomers> {
    const queryBuilder = this.repository.createQueryBuilder("customer");
    if (phone) {
      queryBuilder.andWhere("customer.phone LIKE :phone", {
        phone: `%${phone}%`
      });
    }
    if (name) {
      queryBuilder.andWhere("customer.name LIKE :name", { name: `%${name}%` });
    }
    queryBuilder.skip((pageIndex - 1) * pageSize).take(pageSize);
    const [customers, total] = await queryBuilder.getManyAndCount();
    return {
      pageIndex,
      pageSize,
      total,
      data: customers
    };
  }

  // Lấy một khách hàng theo ID
  async getCustomerById(customerId: number): Promise<Customer> {
    const customer = await this.repository.findOne({
      where: { id: customerId }
    });
    if (!customer) {
      throw new Error("Customer not found");
    }
    return customer;
  }

  // Xóa một khách hàng
  async deleteCustomer(customerId: number): Promise<void> {
    const customer = await this.repository.findOne({
      where: { id: customerId }
    });
    if (!customer) {
      throw new Error("Customer not found");
    }
    await this.repository.remove(customer);
  }

  // Tìm kiếm khách hàng theo tên
  async searchCustomerByName(name: string): Promise<Customer[]> {
    return await this.repository.find({
      where: {
        name: name // Tìm kiếm theo tên khách hàng
      }
    });
  }

  // Tìm kiếm khách hàng theo email
  async searchCustomerByEmail(email: string): Promise<Customer[]> {
    return await this.repository.find({
      where: {
        email: email // Tìm kiếm theo email khách hàng
      }
    });
  }

  // Tìm kiếm khách hàng theo số điện thoại
  async searchCustomerByPhone(phone: string): Promise<Customer[]> {
    return await this.repository.find({
      where: {
        phone: phone // Tìm kiếm theo số điện thoại
      }
    });
  }
}
