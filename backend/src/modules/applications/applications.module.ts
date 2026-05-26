import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ApplicationsController } from './applications.controller';
import { ApplicationsService } from './applications.service';
import { Application } from './models/application.model';
import { Job } from '../jobs/models/job.model';
import { Company } from '../companies/models/company.model';

@Module({
  imports: [SequelizeModule.forFeature([Application, Job, Company])],
  controllers: [ApplicationsController],
  providers: [ApplicationsService],
})
export class ApplicationsModule {}
