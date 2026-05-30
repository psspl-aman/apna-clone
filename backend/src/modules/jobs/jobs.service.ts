import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op, WhereOptions, Sequelize } from 'sequelize';
import { Job } from './models/job.model';
import { Company } from '../companies/models/company.model';
import { Application } from '../applications/models/application.model';
import { SavedJob } from './models/saved-job.model';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { JobFilterDto } from './dto/job-filter.dto';

@Injectable()
export class JobsService {
  constructor(
    @InjectModel(Job) private readonly jobModel: typeof Job,
    @InjectModel(SavedJob) private readonly savedJobModel: typeof SavedJob,
    @InjectModel(Application) private readonly applicationModel: typeof Application,
  ) {}

  async findAll(filters: JobFilterDto) {
    const where: WhereOptions = { is_active: true };

    if (filters.keyword) {
      where[Op.or as any] = [
        { title: { [Op.iLike]: `%${filters.keyword}%` } },
        { description: { [Op.iLike]: `%${filters.keyword}%` } },
      ];
    }

    if (filters.city) where['city'] = { [Op.iLike]: `%${filters.city}%` };
    if (filters.category) where['category'] = filters.category;
    if (filters.department) where['department'] = filters.department;

    // Work mode maps to job_type (work_from_home) or work_location_type
    if (filters.work_mode) {
      if (filters.work_mode === 'work_from_home') {
        where['job_type'] = 'work_from_home';
      } else {
        where['work_location_type'] = filters.work_mode;
      }
    } else if (filters.job_type) {
      where['job_type'] = filters.job_type;
    }

    // Gender filter: if male/female, include 'any' jobs too
    if (filters.gender && filters.gender !== 'any') {
      where['gender'] = { [Op.in]: [filters.gender, 'any'] };
    }

    if (filters.salary_min) {
      where['salary_max'] = { [Op.gte]: filters.salary_min };
    }

    if (filters.exp_min !== undefined && filters.exp_min > 0) {
      where['experience_max'] = { [Op.gte]: filters.exp_min };
    }

    if (filters.date_posted && filters.date_posted !== 'all') {
      const days: Record<string, number> = { '24h': 1, '3d': 3, '7d': 7 };
      const dayCount = days[filters.date_posted] || 7;
      where['created_at'] = {
        [Op.gte]: new Date(Date.now() - dayCount * 24 * 60 * 60 * 1000),
      };
    }

    const page = filters.page || 1;
    const limit = filters.limit || 10;
    const offset = (page - 1) * limit;

    let order: any[] = [['created_at', 'DESC']];
    if (filters.sort_by === 'salary') {
      order = [['salary_max', 'DESC']];
    }

    const { count, rows } = await this.jobModel.findAndCountAll({
      where,
      include: [{ model: Company, attributes: ['id', 'name', 'logo_url', 'city'] }],
      limit,
      offset,
      order,
      distinct: true,
    });

    return {
      jobs: rows,
      meta: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit),
      },
    };
  }

  async findById(id: string) {
    const job = await this.jobModel.findByPk(id, {
      include: [{ model: Company }],
    });
    if (!job) throw new NotFoundException('Job not found');
    const applicantCount = await this.applicationModel.count({ where: { job_id: id } });
    const jobData = job.toJSON() as any;
    jobData.applicantCount = applicantCount;
    return jobData;
  }

  async create(dto: CreateJobDto, companyId: string) {
    return this.jobModel.create({
      ...dto,
      company_id: companyId,
    } as any);
  }

  async update(id: string, dto: UpdateJobDto, userId: string) {
    const job = await this.jobModel.findByPk(id, {
      include: [{ model: Company }],
    });
    if (!job) throw new NotFoundException('Job not found');
    if (job.company.user_id !== userId) throw new ForbiddenException('Not your job');

    await job.update(dto as any);
    return job;
  }

  async delete(id: string, userId: string) {
    const job = await this.jobModel.findByPk(id, {
      include: [{ model: Company }],
    });
    if (!job) throw new NotFoundException('Job not found');
    if (job.company.user_id !== userId) throw new ForbiddenException('Not your job');

    await job.destroy();
    return { success: true };
  }

  async findByCompany(companyId: string) {
    return this.jobModel.findAll({
      where: { company_id: companyId },
      order: [['created_at', 'DESC']],
    });
  }

  async saveJob(userId: string, jobId: string) {
    const [record] = await this.savedJobModel.findOrCreate({
      where: { user_id: userId, job_id: jobId },
      defaults: { user_id: userId, job_id: jobId } as any,
    });
    return record;
  }

  async unsaveJob(userId: string, jobId: string) {
    await this.savedJobModel.destroy({ where: { user_id: userId, job_id: jobId } });
    return { success: true };
  }

  async getSavedJobs(userId: string) {
    const saved = await this.savedJobModel.findAll({
      where: { user_id: userId },
      include: [{
        model: Job,
        include: [{ model: Company, attributes: ['id', 'name', 'logo_url', 'city'] }],
      }],
      order: [['created_at', 'DESC']],
    });
    return saved.map((s: any) => s.job).filter(Boolean);
  }
}
