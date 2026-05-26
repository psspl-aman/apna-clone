import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { City } from './models/city.model';

@Injectable()
export class CitiesService {
  constructor(
    @InjectModel(City) private readonly cityModel: typeof City,
  ) {}

  async findAll() {
    return this.cityModel.findAll({ where: { is_active: true } });
  }
}
