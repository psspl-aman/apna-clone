import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { CandidatesController } from './candidates.controller';
import { CandidatesService } from './candidates.service';
import { CandidateProfile } from './models/candidate-profile.model';

@Module({
  imports: [SequelizeModule.forFeature([CandidateProfile])],
  controllers: [CandidatesController],
  providers: [CandidatesService],
})
export class CandidatesModule {}
