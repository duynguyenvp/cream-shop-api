import { IsString, IsEmail, IsOptional, IsEnum } from 'class-validator';
import { ROLES_ENUM } from 'src/db/roles';

export class CreateEmployeeDTO {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsEnum(ROLES_ENUM)
  role: string;

  @IsOptional()
  @IsString()
  phone?: string;
}
