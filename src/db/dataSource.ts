import { DataSource } from "typeorm";
import { DataSourceOptions } from "typeorm/data-source/DataSourceOptions";
import { Employee } from "./models/Employee";
import { Order } from "./models/Order";
import { Customer } from "./models/Customer";
import { OrderDetail } from "./models/OrderDetail";
import { Inventory } from "./models/Inventory";
import { Recipe } from "./models/Recipe";
import { MenuItem } from "./models/MenuItem";
import { Payment } from "./models/Payment";
import { LoyaltyPoint } from "./models/LoyaltyPoints";

import "dotenv/config";

let connectionOptions: DataSourceOptions = {
  type: "postgres",
  host: process.env.DB_HOST,
  port: process.env.DB_PORT ? +process.env.DB_PORT : 5432,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  synchronize: false,
  logging: true,
  entities: [Employee, Order, Customer, OrderDetail, Inventory, Recipe, MenuItem, Payment, LoyaltyPoint ],
  migrations: ["src/db/migrations/*.ts"]
};

export default new DataSource({
  ...connectionOptions
});
