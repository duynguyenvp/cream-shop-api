import { validate } from "class-validator";
import { Employee } from "../models/Employee";
import { CreateEmployeeDTO } from "../../dto/createEmployee.dto";
import { DataSource, Repository } from "typeorm";
import PaginatedEmployees from "../../dto/paginatedEmployee.dto";
import { removeAccents } from "../../utils/removeAccents";

class EmployeeRepository {
  private repository: Repository<Employee>;

  constructor(dataSource: DataSource) {
    this.repository = dataSource.getRepository(Employee);
  }
  async findById(id: number) {
    const employee = await this.repository.findOne({
      where: { id }
    });
    if (!employee) {
      throw new Error(`Employee with id ${id} not found`);
    }
    return employee;
  }

  async findByEmail(email: string) {
    const employee = await this.repository.findOne({
      where: { email }
    });
    if (!employee) {
      throw new Error(`Employee with email ${email} not found`);
    }
    return employee;
  }

  // Lấy tất cả khách hàng
  async getEmployees(
    pageIndex: number,
    pageSize: number,
    keyword: string
  ): Promise<PaginatedEmployees> {
    const queryBuilder = this.repository.createQueryBuilder("employee");
    if (keyword) {
      queryBuilder
        .where("employee.search_vector @@ to_tsquery(:query)", {
          query: removeAccents(keyword).split(" ").join(" & ")
        });
      queryBuilder
        .andWhere("employee.phone LIKE :phone", {
          phone: `%${keyword}%`
        })
        .andWhere("customer.email LIKE :email", { email: `%${keyword}%` });
    }
    queryBuilder.skip((pageIndex - 1) * pageSize).take(pageSize);
    const [employees, total] = await queryBuilder.getManyAndCount();
    return {
      pageIndex,
      pageSize,
      total,
      data: employees
    };
  }

  async createEmployee(createEmployeeDTO: CreateEmployeeDTO) {
    const errors = await validate(createEmployeeDTO);
    if (errors.length > 0) {
      throw new Error("Validation failed: " + JSON.stringify(errors));
    }
    const employee = this.repository.create(createEmployeeDTO);
    await this.repository.save(employee);
    return employee;
  }

  async updateEmployee(id: number, updateData: Partial<Employee>) {
    const employee = await this.findById(id);
    const updatedEmployee = Object.assign(employee, updateData);
    await this.repository.save(updatedEmployee);
    return updatedEmployee;
  }

  async deleteEmployee(id: number) {
    const employee = await this.findById(id);
    await this.repository.remove(employee);
  }

  async isEmailExist(email: string) {
    const employee = await this.repository.findOne({
      where: { email }
    });
    return !!employee;
  }
}

export default EmployeeRepository;
