import { Controller, Get, Post, Patch, Param, Body, UseGuards } from '@nestjs/common';
import { ApplicationsService } from './applications.service';
import { UpdateApplicationStatusDto } from './dto/update-application-status.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('applications')
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @Post(':jobId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('candidate')
  async apply(@Param('jobId') jobId: string, @CurrentUser() user: any) {
    const application = await this.applicationsService.apply(jobId, user.candidateId);
    return { success: true, message: 'Application submitted', data: application };
  }

  @Get('my')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('candidate')
  async findMy(@CurrentUser() user: any) {
    const data = await this.applicationsService.findByCandidate(user.candidateId);
    return { success: true, message: 'My applications fetched', data };
  }

  @Get('job/:jobId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('employer')
  async findByJob(@Param('jobId') jobId: string, @CurrentUser('id') userId: string) {
    const data = await this.applicationsService.findByJob(jobId, userId);
    return { success: true, message: 'Applications fetched', data };
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('employer')
  async updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateApplicationStatusDto,
    @CurrentUser('id') userId: string,
  ) {
    const application = await this.applicationsService.updateStatus(id, dto, userId);
    return { success: true, message: 'Status updated', data: application };
  }
}
