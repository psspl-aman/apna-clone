import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CandidateProfile } from './models/candidate-profile.model';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class CandidatesService {
  constructor(
    @InjectModel(CandidateProfile) private readonly candidateModel: typeof CandidateProfile,
  ) {}

  async getProfile(userId: string) {
    const profile = await this.candidateModel.findOne({ where: { user_id: userId } });
    if (!profile) throw new NotFoundException('Profile not found');
    return profile;
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    const profile = await this.candidateModel.findOne({ where: { user_id: userId } });
    if (!profile) throw new NotFoundException('Profile not found');

    await profile.update(dto as any);
    return profile;
  }

  async updateResume(userId: string, resumeUrl: string) {
    const profile = await this.candidateModel.findOne({ where: { user_id: userId } });
    if (!profile) throw new NotFoundException('Profile not found');

    await profile.update({ resume_url: resumeUrl } as any);
    return profile;
  }
}
