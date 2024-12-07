import { validate } from "class-validator";
import { Employee } from "../models/Employee";
import { CreateEmployeeDTO } from "../../dto/createEmployee.dto";
import { DataSource, Repository } from "typeorm";

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
