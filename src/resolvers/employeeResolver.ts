import { Resolver, Query, Mutation, Arg } from "type-graphql";
import dataSource from "../db/dataSource";
import UserDTO, { UpdateUserInputDTO } from "../dto/user.dto";
import EmployeeController from "../controllers/employee.controller";
import EmployeeRepository from "../db/repositories/employeeRepository";
import PaginatedEmployees from "../dto/paginatedEmployee.dto";

@Resolver()
export class EmployeeResolver {
  @Query(() => UserDTO)
  async employee(@Arg("id") id: number): Promise<UserDTO> {
    const employeeController = new EmployeeController(
      new EmployeeRepository(dataSource)
    );
    const customer = await employeeController.employee(id);
    return customer;
  }

  @Query(() => PaginatedEmployees)
  async employees(
    @Arg("pageIndex") pageIndex: number,
    @Arg("pageSize") pageSize: number,
    @Arg("keyword", { nullable: true }) keyword: string
  ): Promise<PaginatedEmployees> {
    const employeeController = new EmployeeController(
      new EmployeeRepository(dataSource)
    );
    return employeeController.employees(pageIndex, pageSize, keyword);
  }

  @Mutation(() => UserDTO)
  async updateEmployee(
    @Arg("data") data: UpdateUserInputDTO
  ): Promise<UserDTO> {
    const employeeController = new EmployeeController(
      new EmployeeRepository(dataSource)
    );
    return employeeController.updateEmployee(data);
  }

  @Mutation(() => Boolean)
  async deleteEmployee(@Arg("id") id: number): Promise<boolean> {
    const employeeController = new EmployeeController(
      new EmployeeRepository(dataSource)
    );
    return employeeController.deleteEmployee(id);
  }
}
