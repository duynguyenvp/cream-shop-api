import bcrypt from "bcryptjs";
import { Resolver, Mutation, Arg, Authorized, Query, Ctx } from "type-graphql";
import jwt from "jsonwebtoken";
import { Employee } from "../db/models/Employee";
import { LoginInput, LoginResponse, RegisterInput } from "../dto/authDto";
import dataSource from "../db/dataSource";
import UserDto from "../dto/userDto";
import { Context } from "../types/Context";
// import logger from "logger";

const AUTH_SECRET_KEY = process.env.AUTH_SECRET_KEY || "this is a scret key"
const tokenExpiresIn = parseInt(process.env.TOKEN_EXPIRES_IN || "600");
const refreshTokenExpiresIn = process.env.REFRESH_TOKEN_EXPIRES_IN || "1d";

@Resolver()
export class AuthResolver {
  @Authorized("read_record")
  @Query(() => UserDto, { nullable: true })
  async profile(@Ctx() { user }: Context): Promise<UserDto | null> {
    try {
      const employeeRepository = dataSource.getRepository(Employee);

      const exitingUser = await employeeRepository.find({
        where: { id: user?.id }
      });
      if (!exitingUser) return null;
      return null;
    } catch (error) {
      // logger.error("Failed to retrieve user profile", error);
      return null;
    }
  }
  // Đăng ký người dùng mới
  @Mutation(() => UserDto)
  async register(@Arg("input") input: RegisterInput): Promise<UserDto> {
    const employeeRepository = dataSource.getRepository(Employee);
    const { name, email, phone_number, password } = input;
    const hashedPassword = await bcrypt.hash(password, 10);
    const employee = employeeRepository.create({
      name,
      email,
      phone: phone_number,
      password: hashedPassword
    });
    return await employeeRepository.save(employee);
  }

  // Đăng nhập và trả về JWT
  @Mutation(() => LoginResponse)
  async login(@Arg("input") input: LoginInput): Promise<LoginResponse> {
    const { email, password } = input;
    const employeeRepository = dataSource.getRepository(Employee); // Sử dụng DataSource

    // Tìm nhân viên theo email
    const employee = await employeeRepository.findOne({ where: { email } });
    if (!employee) {
      throw new Error("Employee not found");
    }

    // Kiểm tra mật khẩu
    const isPasswordValid = await bcrypt.compare(password, employee.password);
    if (!isPasswordValid) {
      throw new Error("Invalid password");
    }

    // Tạo JWT token
    const payload = {
      sub: employee.id,
      email: employee.email,
      role: employee.role
    };
    const accessToken = jwt.sign(payload, AUTH_SECRET_KEY, {
      expiresIn: tokenExpiresIn
    });
    const refreshToken = jwt.sign(payload, AUTH_SECRET_KEY, {
      expiresIn: refreshTokenExpiresIn
    });

    return {
      token: accessToken,
      refreshToken,
      user: {
        id: employee.id,
        name: employee.name,
        email: employee.email,
        role: employee.role,
        phone: employee.phone
      }
    };
  }

  // // Query lấy danh sách đơn hàng của nhân viên
  // @Query(() => [Order])
  // async getOrders(@Arg("employee_id") employee_id: number): Promise<Order[]> {
  //   const orderRepository = dataSource.getRepository(Order);
  //   return await orderRepository.find({ where: { employee: { id: employee_id } } });
  // }
}
