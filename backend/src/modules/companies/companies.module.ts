import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { CompaniesController } from './companies.controller';
import { CompaniesService } from './companies.service';
import { Company } from './models/company.model';

@Module({
  imports: [SequelizeModule.forFeature([Company])],
  controllers: [CompaniesController],
  providers: [CompaniesService],
})
export class CompaniesModule {}
