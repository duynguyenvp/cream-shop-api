import "dotenv/config";
import bcrypt from "bcryptjs";
import jwt, { JwtPayload } from "jsonwebtoken";

import {
  LoginInputDTO,
  LoginResponseDTO,
  RegisterInputDTO
} from "../dto/auth.dto";
import { UserSimpleDTO } from "../dto/user.dto";
import logger from "../logger";
import UserDTO from "../dto/user.dto";
import EmployeeRepository from "../db/repositories/employeeRepository";
import { Employee } from "src/db/models/Employee";

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
    const employee = await this.employeeRepository.findByEmail(email);
    if (!employee) {
      throw new Error("Employee not found");
    }

    // Kiểm tra mật khẩu
    const isPasswordValid = await bcrypt.compare(password, employee.password);
    if (!isPasswordValid) {
      throw new Error("Invalid password");
    }

    return this.createLoginResponse(employee);
  }

  async profile(user: UserSimpleDTO | null): Promise<UserDTO | null> {
    if (!user || !user.id) return null;
    try {
      const exitingUser = await this.employeeRepository.findById(user.id);
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

  async refreshToken(refreshToken: string): Promise<LoginResponseDTO> {
    if (!refreshToken) {
      throw new Error("Access Denied. No refresh token provided.");
    }
    try {
      const decoded = jwt.verify(refreshToken, AUTH_SECRET_KEY) as JwtPayload;
      if (decoded.type !== "refresh") {
        throw new Error("Invalid refresh token type");
      }
      const user = await this.employeeRepository.findById(decoded.userId);
      if (!user) {
        throw new Error("Invalid refresh token.");
      }
      return this.createLoginResponse(user);
    } catch (error) {
      throw error;
    }
  }

  private createLoginResponse(user: Employee) {
    const payload = {
      userId: user.id,
      email: user.email,
      role: user.role
    };
    const accessToken = jwt.sign(
      {
        ...payload,
        type: "access"
      },
      AUTH_SECRET_KEY,
      {
        expiresIn: tokenExpiresIn
      }
    );
    const newRefreshToken = jwt.sign(
      {
        ...payload,
        type: "refresh"
      },
      AUTH_SECRET_KEY,
      {
        expiresIn: refreshTokenExpiresIn
      }
    );
    return {
      token: accessToken,
      refreshToken: newRefreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone
      }
    };
  }
}
