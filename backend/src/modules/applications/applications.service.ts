import { Injectable, ConflictException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Application } from './models/application.model';
import { Job } from '../jobs/models/job.model';
import { Company } from '../companies/models/company.model';
import { UpdateApplicationStatusDto } from './dto/update-application-status.dto';

@Injectable()
export class ApplicationsService {
  constructor(
    @InjectModel(Application) private readonly applicationModel: typeof Application,
    @InjectModel(Job) private readonly jobModel: typeof Job,
    @InjectModel(Company) private readonly companyModel: typeof Company,
  ) {}

  async apply(jobId: string, candidateId: string) {
    const existing = await this.applicationModel.findOne({
      where: { job_id: jobId, candidate_id: candidateId },
    });
    if (existing) throw new ConflictException('Already applied to this job');

    const job = await this.jobModel.findByPk(jobId);
    if (!job) throw new NotFoundException('Job not found');
    if (!job.is_active) throw new NotFoundException('Job is no longer active');

    return this.applicationModel.create({
      job_id: jobId,
      candidate_id: candidateId,
      applied_at: new Date(),
    } as any);
  }

  async findByCandidate(candidateId: string) {
    return this.applicationModel.findAll({
      where: { candidate_id: candidateId },
      include: [{ model: Job, include: [{ model: Company, attributes: ['id', 'name', 'logo_url', 'city'] }] }],
      order: [['applied_at', 'DESC']],
    });
  }

  async findByJob(jobId: string, userId: string) {
    const job = await this.jobModel.findByPk(jobId);
    if (!job) throw new NotFoundException('Job not found');

    const company = await this.companyModel.findByPk(job.company_id);
    if (!company || company.user_id !== userId) throw new ForbiddenException('Not your job');

    return this.applicationModel.findAll({
      where: { job_id: jobId },
      include: [{ model: Job }],
      order: [['applied_at', 'DESC']],
    });
  }

  async updateStatus(id: string, dto: UpdateApplicationStatusDto, userId: string) {
    const application = await this.applicationModel.findByPk(id);
    if (!application) throw new NotFoundException('Application not found');

    const job = await this.jobModel.findByPk(application.job_id);
    if (!job) throw new NotFoundException('Job not found');

    const company = await this.companyModel.findByPk(job.company_id);
    if (!company || company.user_id !== userId) throw new ForbiddenException('Not authorized');

    await application.update({ status: dto.status } as any);
    return this.applicationModel.findByPk(id, {
      include: [{ model: Job }],
    });
  }
}
