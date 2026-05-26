import { IsEnum } from 'class-validator';

export class UpdateApplicationStatusDto {
  @IsEnum(['applied', 'shortlisted', 'rejected', 'hired'])
  status: string;
}
