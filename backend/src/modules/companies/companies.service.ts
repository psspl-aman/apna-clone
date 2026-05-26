import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Company } from './models/company.model';
import { UpdateCompanyDto } from './dto/update-company.dto';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectModel(Company) private readonly companyModel: typeof Company,
  ) {}

  async findByUser(userId: string) {
    const company = await this.companyModel.findOne({ where: { user_id: userId } });
    if (!company) throw new NotFoundException('Company not found');
    return company;
  }

  async update(userId: string, dto: UpdateCompanyDto) {
    const company = await this.companyModel.findOne({ where: { user_id: userId } });
    if (!company) throw new NotFoundException('Company not found');

    await company.update(dto as any);
    return company;
  }
}
