import { DataSource } from "typeorm";
import { OrderRepository } from "./repositories/orderRepository";
import { InventoryRepository } from "./repositories/InventoryRepository";
import { OrderDetailRepository } from "./repositories/orderDetailRepository";
import { CustomerRepository } from "./repositories/customerRepository";
import { RecipeRepository } from "./repositories/recipeRepository";
import { PaymentRepository } from "./repositories/paymentRepository";
import EmployeeRepository from "./repositories/employeeRepository";
import { MenuItemRepository } from "./repositories/menuItemRepository";
import { LoyaltyPointRepository } from "./repositories/loyaltyPointRepository";
import { Customer } from "./models/Customer";
import { Employee } from "./models/Employee";
import { Inventory } from "./models/Inventory";
import { LoyaltyPoint } from "./models/LoyaltyPoints";
import { MenuItem } from "./models/MenuItem";
import { Order } from "./models/Order";
import { OrderDetail } from "./models/OrderDetail";
import { Payment } from "./models/Payment";
import { Recipe } from "./models/Recipe";

export interface IUnitOfWork {
  customerRepository: CustomerRepository;
  employeeRepository: EmployeeRepository;
  inventoryRepository: InventoryRepository;
  loyaltyPointRepository: LoyaltyPointRepository;
  menuItemRepository: MenuItemRepository;
  orderRepository: OrderRepository;
  orderDetailRepository: OrderDetailRepository;
  paymentRepository: PaymentRepository;
  recipeRepository: RecipeRepository;

  doTransaction(callback: Function): Promise<void>;
}
export class UnitOfWork implements IUnitOfWork {
  private _orderRepository: OrderRepository;
  private _inventoryRepository: InventoryRepository;
  private _orderDetailRepository: OrderDetailRepository;
  private _customerRepository: CustomerRepository;
  private _loyaltyPointRepository: LoyaltyPointRepository;
  private _paymentRepository: PaymentRepository;
  private _employeeRepository: EmployeeRepository;
  private _menuItemRepository: MenuItemRepository;
  private _recipeRepository: RecipeRepository;

  private _dataSource: DataSource;

  constructor(dataSource: DataSource) {
    this._dataSource = dataSource;

    const customerSourceRepo = this._dataSource.getRepository(Customer);
    const employeeSourceRepo = this._dataSource.getRepository(Employee);
    const inventorySourceRepo = this._dataSource.getRepository(Inventory);
    const loyaltyPointSourceRepo = this._dataSource.getRepository(LoyaltyPoint);
    const menuItemSourceRepo = this._dataSource.getRepository(MenuItem);
    const paymentSourceRepo = this._dataSource.getRepository(Payment);
    const recipeSourceRepo = this._dataSource.getRepository(Recipe);

    this._inventoryRepository = new InventoryRepository(inventorySourceRepo);
    this._customerRepository = new CustomerRepository(customerSourceRepo);
    this._loyaltyPointRepository = new LoyaltyPointRepository(loyaltyPointSourceRepo);
    this._paymentRepository = new PaymentRepository(paymentSourceRepo);
    this._employeeRepository = new EmployeeRepository(employeeSourceRepo);
    this._menuItemRepository = new MenuItemRepository(menuItemSourceRepo);
    this._recipeRepository = new RecipeRepository(recipeSourceRepo, this._menuItemRepository, this._inventoryRepository);
  }

  // Các getter cho các repository
  get orderRepository(): OrderRepository {
    return this._orderRepository;
  }

  get inventoryRepository(): InventoryRepository {
    return this._inventoryRepository;
  }

  get orderDetailRepository(): OrderDetailRepository {
    return this._orderDetailRepository;
  }

  get customerRepository(): CustomerRepository {
    return this._customerRepository;
  }

  get loyaltyPointRepository(): LoyaltyPointRepository {
    return this._loyaltyPointRepository;
  }

  get paymentRepository(): PaymentRepository {
    return this._paymentRepository;
  }

  get employeeRepository(): EmployeeRepository {
    return this._employeeRepository;
  }

  get recipeRepository(): RecipeRepository {
    return this._recipeRepository;
  }

  get menuItemRepository(): MenuItemRepository {
    return this._menuItemRepository;
  }

  // Khởi tạo transaction
  async doTransaction(callback: Function): Promise<void> {
    await this._dataSource.transaction(async transactionalEntityManager => {
      const orderRepo = this._dataSource.getRepository(Order);
      const orderDetailRepo = this._dataSource.getRepository(OrderDetail);
      this._orderRepository = new OrderRepository(
        orderRepo,
        this._customerRepository,
        this._employeeRepository,
        this._orderDetailRepository,
        this._paymentRepository,
        transactionalEntityManager
      );
      this._orderDetailRepository = new OrderDetailRepository(
        orderDetailRepo,
        this._inventoryRepository,
        transactionalEntityManager
      );

      callback();
    });
  }
}
