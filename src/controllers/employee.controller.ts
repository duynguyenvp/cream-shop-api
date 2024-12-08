import "dotenv/config";

import EmployeeRepository from "../db/repositories/employeeRepository";
import UserDTO, { UpdateUserInputDTO } from "../dto/user.dto";
import PaginatedEmployees from "../dto/paginatedEmployee.dto";
import { removeEmptyFields } from "../utils/removeEmptyFields";

export default class EmployeeController {
  private employeeRepository: EmployeeRepository;
  constructor(employeeRepository: EmployeeRepository) {
    this.employeeRepository = employeeRepository;
  }

  async employee(id: number): Promise<UserDTO> {
    const employee = await this.employeeRepository.findById(id);
    if (!employee) {
      throw new Error("Employee not found");
    }
    return employee;
  }

  async employees(
    pageIndex: number,
    pageSize: number,
    keyword: string
  ): Promise<PaginatedEmployees> {
    return this.employeeRepository.getEmployees(pageIndex, pageSize, keyword);
  }

  async updateEmployee(data: UpdateUserInputDTO): Promise<UserDTO> {
    const updateData = removeEmptyFields(data);
    return this.employeeRepository.updateEmployee(data.id, updateData);
  }

  async deleteEmployee(id: number): Promise<boolean> {
    await this.employeeRepository.deleteEmployee(id);
    return true;
  }
}
