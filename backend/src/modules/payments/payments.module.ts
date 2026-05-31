import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { Job } from '../jobs/models/job.model';
import { Company } from '../companies/models/company.model';
import { Payment } from './models/payment.model';

@Module({
  imports: [SequelizeModule.forFeature([Job, Company, Payment])],
  controllers: [PaymentsController],
  providers: [PaymentsService],
})
export class PaymentsModule {}
