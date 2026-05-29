import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { Job } from '../jobs/models/job.model';
import { Company } from '../companies/models/company.model';

@Module({
  imports: [SequelizeModule.forFeature([Job, Company])],
  controllers: [PaymentsController],
  providers: [PaymentsService],
})
export class PaymentsModule {}
