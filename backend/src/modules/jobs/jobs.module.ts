import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { JobsController } from './jobs.controller';
import { JobsService } from './jobs.service';
import { Job } from './models/job.model';
import { Company } from '../companies/models/company.model';
import { SavedJob } from './models/saved-job.model';
import { User } from '../users/models/user.model';
import { Application } from '../applications/models/application.model';

@Module({
  imports: [SequelizeModule.forFeature([Job, Company, SavedJob, User, Application])],
  controllers: [JobsController],
  providers: [JobsService],
  exports: [JobsService],
})
export class JobsModule {}
