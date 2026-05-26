import { IsOptional, IsString, IsNumber, IsEnum, Min } from 'class-validator';
import { Transform, Type } from 'class-transformer';

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
  @IsEnum(['full_time', 'part_time', 'work_from_home', 'night_shift'])
  job_type?: string;

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
  @IsEnum(['24h', '3d', '7d', 'all'])
  date_posted?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  limit?: number = 10;
}
