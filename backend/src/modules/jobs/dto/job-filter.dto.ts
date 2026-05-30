import { IsOptional, IsString, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class JobFilterDto {
  @IsOptional()
  @IsString()
  keyword?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  department?: string;

  @IsOptional()
  @IsString()
  job_type?: string;

  @IsOptional()
  @IsString()
  work_mode?: string; // work_from_home | work_from_office | field_job

  @IsOptional()
  @IsString()
  gender?: string; // any | male | female

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  salary_min?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  exp_min?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  exp_max?: number;

  @IsOptional()
  @IsString()
  date_posted?: string; // 24h | 3d | 7d | all

  @IsOptional()
  @IsString()
  sort_by?: string; // relevance | recent | salary

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  limit?: number = 10;
}
