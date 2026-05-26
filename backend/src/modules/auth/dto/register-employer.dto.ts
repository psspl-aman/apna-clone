import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';

export class RegisterEmployerDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  companyName: string;

  @IsOptional()
  @IsString()
  city?: string;
}
