import { IsString, IsOptional, IsNumber, IsBoolean, IsArray, Min } from 'class-validator';
import { Type, Transform } from 'class-transformer';

export class CreateJobDto {
  @IsString()
  title: string;

  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsString() category?: string;
  @IsOptional() @IsString() department?: string;
  @IsOptional() @IsString() city?: string;
  @IsOptional() @IsString() job_type?: string;

  @IsOptional() @Type(() => Number) @IsNumber() @Min(0) salary_min?: number;
  @IsOptional() @Type(() => Number) @IsNumber() @Min(0) salary_max?: number;
  @IsOptional() @Type(() => Number) @IsNumber() @Min(0) experience_min?: number;
  @IsOptional() @Type(() => Number) @IsNumber() @Min(0) experience_max?: number;

  @IsOptional() @IsString() education?: string;
  @IsOptional() @IsString() gender?: string;
  @IsOptional() @Type(() => Number) @IsNumber() @Min(1) openings?: number;

  // Advanced fields
  @IsOptional() @IsString() work_location_type?: string;
  @IsOptional() @IsString() pay_type?: string;
  @IsOptional() @IsArray() perks?: string[];
  @IsOptional() @IsBoolean() has_joining_fee?: boolean;
  @IsOptional() @IsBoolean() is_night_shift?: boolean;
  @IsOptional() @IsString() english_level?: string;
  @IsOptional() @IsString() experience_type?: string;
  @IsOptional() @IsBoolean() is_walkin?: boolean;
  @IsOptional() @IsString() contact_preference?: string;
  @IsOptional() @IsString() plan_type?: string;
  @IsOptional() @IsBoolean() is_paid?: boolean;
  @IsOptional() @IsString() razorpay_payment_id?: string;
}
