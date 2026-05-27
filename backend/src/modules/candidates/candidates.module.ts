import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { CandidatesController } from './candidates.controller';
import { CandidatesService } from './candidates.service';
import { CandidateProfile } from './models/candidate-profile.model';
import { WorkExperience } from './models/work-experience.model';
import { Education } from './models/education.model';
import { Certification } from './models/certification.model';

@Module({
  imports: [SequelizeModule.forFeature([CandidateProfile, WorkExperience, Education, Certification])],
  controllers: [CandidatesController],
  providers: [CandidatesService],
})
export class CandidatesModule {}
