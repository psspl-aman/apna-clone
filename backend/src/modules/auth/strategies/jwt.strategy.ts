import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '../../users/models/user.model';
import { Company } from '../../companies/models/company.model';
import { CandidateProfile } from '../../candidates/models/candidate-profile.model';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectModel(User) private readonly userModel: typeof User,
    @InjectModel(Company) private readonly companyModel: typeof Company,
    @InjectModel(CandidateProfile) private readonly candidateModel: typeof CandidateProfile,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_ACCESS_SECRET || 'default-access-secret',
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.userModel.findByPk(payload.sub);

    if (!user) {
      return {
        id: payload.sub,
        email: payload.email,
        role: payload.role,
      };
    }

    const company = await this.companyModel.findOne({ where: { user_id: payload.sub } });
    const candidate = await this.candidateModel.findOne({ where: { user_id: payload.sub } });

    return {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
      companyId: company?.id || null,
      candidateId: candidate?.id || null,
    };
  }
}
