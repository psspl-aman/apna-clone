import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CandidateProfile } from './models/candidate-profile.model';
import { WorkExperience } from './models/work-experience.model';
import { Education } from './models/education.model';
import { Certification } from './models/certification.model';

@Injectable()
export class CandidatesService {
  constructor(
    @InjectModel(CandidateProfile) private readonly candidateModel: typeof CandidateProfile,
    @InjectModel(WorkExperience) private readonly workExpModel: typeof WorkExperience,
    @InjectModel(Education) private readonly educationModel: typeof Education,
    @InjectModel(Certification) private readonly certModel: typeof Certification,
  ) {}

  async getProfile(userId: string) {
    const profile = await this.candidateModel.findOne({
      where: { user_id: userId },
      include: [
        { model: WorkExperience },
        { model: Education },
        { model: Certification },
      ],
    });
    if (!profile) throw new NotFoundException('Profile not found');

    const workExperiences = profile.workExperiences || [];
    const educations = profile.educations || [];
    const certifications = profile.certifications || [];
    const completion = this.calculateCompletion(profile, workExperiences, educations, certifications);

    return {
      profile,
      workExperiences,
      educations,
      certifications,
      profileCompletion: completion,
    };
  }

  async updateProfile(userId: string, dto: any) {
    const profile = await this.candidateModel.findOne({ where: { user_id: userId } });
    if (!profile) throw new NotFoundException('Profile not found');

    await profile.update(dto);

    const workExps = await this.workExpModel.findAll({ where: { candidate_id: profile.id } });
    const educations = await this.educationModel.findAll({ where: { candidate_id: profile.id } });
    const certs = await this.certModel.findAll({ where: { candidate_id: profile.id } });
    const completion = this.calculateCompletion(profile, workExps, educations, certs);
    await profile.update({ profile_completion: completion });

    return this.getProfile(userId);
  }

  async updateResume(userId: string, filePath: string, fileName: string) {
    const profile = await this.candidateModel.findOne({ where: { user_id: userId } });
    if (!profile) throw new NotFoundException('Profile not found');

    await profile.update({
      resume_url: filePath,
      resume_file_name: fileName,
      resume_updated_at: new Date(),
    });

    return this.getProfile(userId);
  }

  async addWorkExperience(userId: string, dto: any) {
    const profile = await this.candidateModel.findOne({ where: { user_id: userId } });
    if (!profile) throw new NotFoundException('Profile not found');

    const workExp = await this.workExpModel.create({ ...dto, candidate_id: profile.id });
    return workExp;
  }

  async updateWorkExperience(userId: string, id: string, dto: any) {
    const workExp = await this.workExpModel.findByPk(id);
    if (!workExp) throw new NotFoundException('Work experience not found');

    const profile = await this.candidateModel.findOne({ where: { user_id: userId } });
    if (!profile || workExp.candidate_id !== profile.id) {
      throw new ForbiddenException('Not your work experience');
    }

    await workExp.update(dto);
    return workExp;
  }

  async deleteWorkExperience(userId: string, id: string) {
    const workExp = await this.workExpModel.findByPk(id);
    if (!workExp) throw new NotFoundException('Work experience not found');

    const profile = await this.candidateModel.findOne({ where: { user_id: userId } });
    if (!profile || workExp.candidate_id !== profile.id) {
      throw new ForbiddenException('Not your work experience');
    }

    await workExp.destroy();
  }

  async addEducation(userId: string, dto: any) {
    const profile = await this.candidateModel.findOne({ where: { user_id: userId } });
    if (!profile) throw new NotFoundException('Profile not found');

    const education = await this.educationModel.create({ ...dto, candidate_id: profile.id });
    return education;
  }

  async updateEducation(userId: string, id: string, dto: any) {
    const education = await this.educationModel.findByPk(id);
    if (!education) throw new NotFoundException('Education not found');

    const profile = await this.candidateModel.findOne({ where: { user_id: userId } });
    if (!profile || education.candidate_id !== profile.id) {
      throw new ForbiddenException('Not your education');
    }

    await education.update(dto);
    return education;
  }

  async deleteEducation(userId: string, id: string) {
    const education = await this.educationModel.findByPk(id);
    if (!education) throw new NotFoundException('Education not found');

    const profile = await this.candidateModel.findOne({ where: { user_id: userId } });
    if (!profile || education.candidate_id !== profile.id) {
      throw new ForbiddenException('Not your education');
    }

    await education.destroy();
  }

  async addCertification(userId: string, dto: any) {
    const profile = await this.candidateModel.findOne({ where: { user_id: userId } });
    if (!profile) throw new NotFoundException('Profile not found');

    const cert = await this.certModel.create({ ...dto, candidate_id: profile.id });
    return cert;
  }

  async updateCertification(userId: string, id: string, dto: any) {
    const cert = await this.certModel.findByPk(id);
    if (!cert) throw new NotFoundException('Certification not found');

    const profile = await this.candidateModel.findOne({ where: { user_id: userId } });
    if (!profile || cert.candidate_id !== profile.id) {
      throw new ForbiddenException('Not your certification');
    }

    await cert.update(dto);
    return cert;
  }

  async deleteCertification(userId: string, id: string) {
    const cert = await this.certModel.findByPk(id);
    if (!cert) throw new NotFoundException('Certification not found');

    const profile = await this.candidateModel.findOne({ where: { user_id: userId } });
    if (!profile || cert.candidate_id !== profile.id) {
      throw new ForbiddenException('Not your certification');
    }

    await cert.destroy();
  }

  private calculateCompletion(profile: CandidateProfile, workExps: WorkExperience[], educations: Education[], certs: Certification[]): number {
    let score = 0;
    if (profile.full_name) score += 10;
    if (profile.date_of_birth) score += 5;
    if (profile.gender) score += 5;
    if (profile.current_location) score += 5;
    if (profile.skills?.length > 0) score += 10;
    if (profile.resume_url) score += 15;
    if (workExps.length > 0) score += 20;
    if (educations.length > 0) score += 15;
    if (profile.current_salary) score += 5;
    if (profile.languages?.length > 0) score += 5;
    if (certs.length > 0) score += 5;
    return Math.min(score, 100);
  }
}
