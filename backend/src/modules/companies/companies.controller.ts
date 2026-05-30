import { Controller, Get, Put, Body, UseGuards } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Get('me')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('employer')
  async findMe(@CurrentUser('id') userId: string) {
    const data = await this.companiesService.findByUser(userId);
    return { success: true, message: 'Company fetched', data };
  }

  @Put('me')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('employer')
  async update(@CurrentUser('id') userId: string, @Body() dto: UpdateCompanyDto) {
    console.log(userId, dto,"userId, dto");
    const data = await this.companiesService.update(userId, dto);
    return { success: true, message: 'Company updated', data };
  }
}
