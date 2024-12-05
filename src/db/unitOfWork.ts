import EmployeeRepository from "./repositories/EmployeeRepository";
import RecipeRepository from "./repositories/recipeRepository";
import dataSource from "./dataSource";
import { Employee } from "./models/Employee";
import { Recipe } from "./models/Recipe";
import { MenuItem } from "./models/MenuItem";
import { Inventory } from "./models/Inventory";

export class UnitOfWork {
  private employeeRepository: EmployeeRepository;
  private recipeRepository: RecipeRepository;

  constructor() {
    const empoyeeSourceRepo = dataSource.getRepository(Employee);
    const recipeSourceRepo = dataSource.getRepository(Recipe);
    const menuItemSourceRepo = dataSource.getRepository(MenuItem);
    const inventorySourceRepo = dataSource.getRepository(Inventory);
    this.employeeRepository = new EmployeeRepository(empoyeeSourceRepo);
    this.recipeRepository = new RecipeRepository(
      recipeSourceRepo,
      menuItemSourceRepo,
      inventorySourceRepo
    );
  }

  getEmployeeRepository(): EmployeeRepository {
    return this.employeeRepository;
  }

  getRecipeRepository(): RecipeRepository {
    return this.recipeRepository;
  }

  // Commit transaction
  async commit() {
    console.log("commit something");
  }

  // Rollback nếu có lỗi
  async rollback() {
    // Xử lý rollback nếu cần
    console.log("Rollback transaction");
  }
}
