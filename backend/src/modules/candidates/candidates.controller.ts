import { Controller, Get, Put, Post, Body, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { CandidatesService } from './candidates.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
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

  @Put('profile')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('candidate')
  async updateProfile(@CurrentUser('id') userId: string, @Body() dto: UpdateProfileDto) {
    const data = await this.candidatesService.updateProfile(userId, dto);
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
      fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(pdf|doc|docx)$/)) {
          cb(new Error('Only PDF, DOC, DOCX files are allowed'), false);
        }
        cb(null, true);
      },
    }),
  )
  async uploadResume(
    @CurrentUser('id') userId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const data = await this.candidatesService.updateResume(userId, file.path);
    return { success: true, message: 'Resume uploaded', data };
  }
}
