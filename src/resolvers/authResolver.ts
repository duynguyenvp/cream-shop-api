import { Resolver, Mutation, Arg, Authorized, Query, Ctx } from "type-graphql";
import {
  LoginInputDTO,
  LoginResponseDTO,
  RegisterInputDTO
} from "../dto/auth.dto";
import UserDTO from "../dto/user.dto";
import { Context } from "../types/Context";
import AuthController from "../controllers/auth.controller";
import dataSource from "../db/dataSource";
import EmployeeRepository from "../db/repositories/employeeRepository";

@Resolver()
export class AuthResolver {
  @Authorized("read_record")
  @Query(() => UserDTO, { nullable: true })
  async profile(@Ctx() { user }: Context): Promise<UserDTO | null> {
    const authController = new AuthController(
      new EmployeeRepository(dataSource)
    );
    return authController.profile(user);
  }
  // Đăng ký người dùng mới
  @Mutation(() => UserDTO)
  async register(@Arg("input") input: RegisterInputDTO): Promise<UserDTO> {
    const authController = new AuthController(
      new EmployeeRepository(dataSource)
    );
    return authController.register(input);
  }

  // Đăng nhập và trả về JWT
  @Mutation(() => LoginResponseDTO)
  async login(@Arg("input") input: LoginInputDTO): Promise<LoginResponseDTO> {
    const authController = new AuthController(
      new EmployeeRepository(dataSource)
    );
    return authController.login(input);
  }

  @Mutation(() => LoginResponseDTO)
  async refreshToken(
    @Arg("refresh_token") refresh_token: string
  ): Promise<LoginResponseDTO> {
    const authController = new AuthController(
      new EmployeeRepository(dataSource)
    );
    return authController.refreshToken(refresh_token);
  }
}
