import { IsOptional, IsString, IsBoolean, IsArray, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateWorkExperienceDto {
  @IsString() job_title!: string;
  @IsString() company_name!: string;
  @IsOptional() @IsArray() @IsString({ each: true }) job_roles?: string[];
  @IsOptional() @IsString() industry?: string;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsArray() @IsString({ each: true }) skills?: string[];
  @IsOptional() @IsDateString() start_date?: string;
  @IsOptional() @IsDateString() end_date?: string;
  @IsOptional() @IsBoolean() is_current?: boolean;
}

export class UpdateWorkExperienceDto {
  @IsOptional() @IsString() job_title?: string;
  @IsOptional() @IsString() company_name?: string;
  @IsOptional() @IsArray() @IsString({ each: true }) job_roles?: string[];
  @IsOptional() @IsString() industry?: string;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsArray() @IsString({ each: true }) skills?: string[];
  @IsOptional() @IsDateString() start_date?: string;
  @IsOptional() @IsDateString() end_date?: string;
  @IsOptional() @IsBoolean() is_current?: boolean;
}
