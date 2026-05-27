import { IsOptional, IsString, IsBoolean, IsDateString, IsUrl } from 'class-validator';

export class CreateCertificationDto {
  @IsString() name!: string;
  @IsOptional() @IsString() issuing_org?: string;
  @IsOptional() @IsDateString() issue_date?: string;
  @IsOptional() @IsDateString() expiry_date?: string;
  @IsOptional() @IsString() credential_url?: string;
}

export class UpdateCertificationDto {
  @IsOptional() @IsString() name?: string;
  @IsOptional() @IsString() issuing_org?: string;
  @IsOptional() @IsDateString() issue_date?: string;
  @IsOptional() @IsDateString() expiry_date?: string;
  @IsOptional() @IsString() credential_url?: string;
}
