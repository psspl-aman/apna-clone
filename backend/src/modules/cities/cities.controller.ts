import { Controller, Get } from '@nestjs/common';
import { CitiesService } from './cities.service';

@Controller('cities')
export class CitiesController {
  constructor(private readonly citiesService: CitiesService) {}

  @Get()
  async findAll() {
    const data = await this.citiesService.findAll();
    return { success: true, message: 'Cities fetched', data };
  }
}
