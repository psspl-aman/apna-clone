import { IsOptional, IsString, IsNumber, IsArray, Min, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateProfileDto {
  @IsOptional() @IsString() full_name?: string;
  @IsOptional() @IsString() phone?: string;
  @IsOptional() @IsString() city?: string;
  @IsOptional() @Type(() => Number) @IsNumber() @Min(0) experience?: number;
  @IsOptional() @IsArray() @IsString({ each: true }) skills?: string[];

  @IsOptional() @IsString() date_of_birth?: string;
  @IsOptional() @IsString() gender?: string;
  @IsOptional() @IsString() home_town?: string;
  @IsOptional() @IsString() current_location?: string;
  @IsOptional() @Type(() => Number) @IsNumber() @Min(0) current_salary?: number;
  @IsOptional() @Type(() => Number) @IsNumber() @Min(0) total_experience?: number;
  @IsOptional() @IsString() spoken_english_level?: string;
  @IsOptional() @IsString() school_medium?: string;
  @IsOptional() @IsString() highest_education?: string;
  @IsOptional() @IsArray() @IsString({ each: true }) preferred_job_titles?: string[];
  @IsOptional() @IsArray() @IsString({ each: true }) preferred_locations?: string[];
  @IsOptional() languages?: { name: string; level: string }[];
}
