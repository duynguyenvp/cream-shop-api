import "dotenv/config";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import {
  LoginInputDTO,
  LoginResponseDTO,
  RegisterInputDTO
} from "../dto/auth.dto";
import { IUser } from "../types/IUser";
import logger from "../logger";
import UserDTO from "../dto/user.dto";
import EmployeeRepository from "../db/repositories/employeeRepository";

const AUTH_SECRET_KEY = process.env.AUTH_SECRET_KEY || "this is a scret key";
const tokenExpiresIn = parseInt(process.env.TOKEN_EXPIRES_IN || "600");
const refreshTokenExpiresIn = process.env.REFRESH_TOKEN_EXPIRES_IN || "1d";

export default class AuthController {
  private employeeRepository: EmployeeRepository;
  constructor(employeeRepository: EmployeeRepository) {
    this.employeeRepository = employeeRepository;
  }

  async login(input: LoginInputDTO): Promise<LoginResponseDTO> {
    const { email, password } = input;

    // Tìm nhân viên theo email
    const employee = await this.employeeRepository.findByEmail(
      email
    );
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

  async profile(user: IUser | null): Promise<UserDTO | null> {
    if (!user || !user.id) return null;
    try {
      const exitingUser = await this.employeeRepository.findById(
        user.id
      );
      if (!exitingUser) return null;
      return exitingUser;
    } catch (error) {
      logger.error("Failed to retrieve user profile", error);
      return null;
    }
  }

  async register(input: RegisterInputDTO): Promise<UserDTO> {
    const { name, email, phone_number, password } = input;
    const hashedPassword = await bcrypt.hash(password, 10);
    const employee = this.employeeRepository.createEmployee({
      name,
      email,
      phone: phone_number,
      password: hashedPassword
    });
    return employee;
  }
}
