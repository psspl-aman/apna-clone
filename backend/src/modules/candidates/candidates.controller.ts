import {
  Controller, Get, Put, Post, Patch, Delete, Body, Param, UseGuards,
  UseInterceptors, UploadedFile, BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { CandidatesService } from './candidates.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { CreateWorkExperienceDto, UpdateWorkExperienceDto } from './dto/work-experience.dto';
import { CreateEducationDto, UpdateEducationDto } from './dto/education.dto';
import { CreateCertificationDto, UpdateCertificationDto } from './dto/certification.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('candidates')
export class CandidatesController {
  constructor(private readonly candidatesService: CandidatesService) {}

  @Get('profile')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('candidate')
  async getProfile(@CurrentUser('id') userId: string) {
    const data = await this.candidatesService.getProfile(userId);
    return { success: true, message: 'Profile fetched', data };
  }

  @Patch('profile')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('candidate')
  async updateProfile(@CurrentUser('id') userId: string, @Body() dto: UpdateProfileDto) {
    const data = await this.candidatesService.updateProfile(userId, dto as any);
    return { success: true, message: 'Profile updated', data };
  }

  @Post('resume')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('candidate')
  @UseInterceptors(
    FileInterceptor('resume', {
      storage: diskStorage({
        destination: './uploads/resumes',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, uniqueSuffix + extname(file.originalname));
        },
      }),
      limits: { fileSize: 5 * 1024 * 1024 },
      fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(pdf|doc|docx)$/)) {
          cb(new BadRequestException('Only PDF, DOC, DOCX files are allowed'), false);
        }
        cb(null, true);
      },
    }),
  )
  async uploadResume(
    @CurrentUser('id') userId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const data = await this.candidatesService.updateResume(userId, file.path, file.originalname);
    return { success: true, message: 'Resume uploaded', data };
  }

  @Post('work-experience')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('candidate')
  async addWorkExperience(@CurrentUser('id') userId: string, @Body() dto: CreateWorkExperienceDto) {
    const data = await this.candidatesService.addWorkExperience(userId, dto);
    return { success: true, message: 'Work experience added', data };
  }

  @Patch('work-experience/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('candidate')
  async updateWorkExperience(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
    @Body() dto: UpdateWorkExperienceDto,
  ) {
    const data = await this.candidatesService.updateWorkExperience(userId, id, dto as any);
    return { success: true, message: 'Work experience updated', data };
  }

  @Delete('work-experience/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('candidate')
  async deleteWorkExperience(@CurrentUser('id') userId: string, @Param('id') id: string) {
    await this.candidatesService.deleteWorkExperience(userId, id);
    return { success: true, message: 'Work experience deleted', data: null };
  }

  @Post('education')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('candidate')
  async addEducation(@CurrentUser('id') userId: string, @Body() dto: CreateEducationDto) {
    const data = await this.candidatesService.addEducation(userId, dto);
    return { success: true, message: 'Education added', data };
  }

  @Patch('education/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('candidate')
  async updateEducation(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
    @Body() dto: UpdateEducationDto,
  ) {
    const data = await this.candidatesService.updateEducation(userId, id, dto as any);
    return { success: true, message: 'Education updated', data };
  }

  @Delete('education/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('candidate')
  async deleteEducation(@CurrentUser('id') userId: string, @Param('id') id: string) {
    await this.candidatesService.deleteEducation(userId, id);
    return { success: true, message: 'Education deleted', data: null };
  }

  @Post('certifications')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('candidate')
  async addCertification(@CurrentUser('id') userId: string, @Body() dto: CreateCertificationDto) {
    const data = await this.candidatesService.addCertification(userId, dto);
    return { success: true, message: 'Certification added', data };
  }

  @Patch('certifications/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('candidate')
  async updateCertification(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
    @Body() dto: UpdateCertificationDto,
  ) {
    const data = await this.candidatesService.updateCertification(userId, id, dto as any);
    return { success: true, message: 'Certification updated', data };
  }

  @Delete('certifications/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('candidate')
  async deleteCertification(@CurrentUser('id') userId: string, @Param('id') id: string) {
    await this.candidatesService.deleteCertification(userId, id);
    return { success: true, message: 'Certification deleted', data: null };
  }
}
