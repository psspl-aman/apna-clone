import { IsOptional, IsString, IsNumber, IsDateString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateEducationDto {
  @IsOptional() @IsString() degree?: string;
  @IsOptional() @IsString() field_of_study?: string;
  @IsOptional() @IsString() institution?: string;
  @IsOptional() @IsString() education_level?: string;
  @IsOptional() @Type(() => Number) @IsNumber() @Min(1900) batch_year?: number;
}

export class UpdateEducationDto {
  @IsOptional() @IsString() degree?: string;
  @IsOptional() @IsString() field_of_study?: string;
  @IsOptional() @IsString() institution?: string;
  @IsOptional() @IsString() education_level?: string;
  @IsOptional() @Type(() => Number) @IsNumber() @Min(1900) batch_year?: number;
}
