import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { User } from '../users/models/user.model';
import { CandidateProfile } from '../candidates/models/candidate-profile.model';
import { Company } from '../companies/models/company.model';
import { RefreshToken } from './models/refresh-token.model';

@Module({
  imports: [
    SequelizeModule.forFeature([User, CandidateProfile, Company, RefreshToken]),
    JwtModule.register({}),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
