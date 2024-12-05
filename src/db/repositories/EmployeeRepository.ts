import { validate } from "class-validator";
import { Employee } from "../models/Employee";
import { CreateEmployeeDTO } from "../../dto/createEmployee.dto";
import { Repository } from "typeorm";

class EmployeeRepository {
  private _repository: Repository<Employee>;
  constructor(repository: Repository<Employee>) {
    this._repository = repository;
  }
  async findById(id: number) {
    const employee = await this._repository.findOne({
      where: { id },
      relations: ["orders"]
    });
    if (!employee) {
      throw new Error(`Employee with id ${id} not found`);
    }
    return employee;
  }

  async findByEmail(email: string) {
    const employee = await this._repository.findOne({
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
    const employee = this._repository.create(createEmployeeDTO);
    await this._repository.save(employee);
    return employee;
  }

  async updateEmployee(id: number, updateData: Partial<Employee>) {
    const employee = await this.findById(id);
    const updatedEmployee = Object.assign(employee, updateData);
    await this._repository.save(updatedEmployee);
    return updatedEmployee;
  }

  async deleteEmployee(id: number) {
    const employee = await this.findById(id);
    await this._repository.remove(employee);
  }

  async isEmailExist(email: string) {
    const employee = await this._repository.findOne({
      where: { email }
    });
    return !!employee;
  }
}

export default EmployeeRepository;
