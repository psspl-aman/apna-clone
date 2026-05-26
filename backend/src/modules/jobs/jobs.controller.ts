import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { JobFilterDto } from './dto/job-filter.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Get()
  async findAll(@Query() filterDto: JobFilterDto) {
    const result = await this.jobsService.findAll(filterDto);
    return { success: true, message: 'Jobs fetched', data: result.jobs, meta: result.meta };
  }

  @Get('my')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('employer')
  async findMy(@CurrentUser() user: any) {
    const jobs = await this.jobsService.findByCompany(user.companyId);
    return { success: true, message: 'My jobs fetched', data: jobs };
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    const job = await this.jobsService.findById(id);
    return { success: true, message: 'Job fetched', data: job };
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('employer')
  async create(@Body() dto: CreateJobDto, @CurrentUser() user: any) {
    const job = await this.jobsService.create(dto, user.companyId);
    return { success: true, message: 'Job created', data: job };
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('employer')
  async update(@Param('id') id: string, @Body() dto: UpdateJobDto, @CurrentUser('id') userId: string) {
    const job = await this.jobsService.update(id, dto, userId);
    return { success: true, message: 'Job updated', data: job };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('employer')
  async delete(@Param('id') id: string, @CurrentUser('id') userId: string) {
    const result = await this.jobsService.delete(id, userId);
    return { success: true, message: 'Job deleted', data: null };
  }
}
