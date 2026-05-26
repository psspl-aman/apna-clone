import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../users/models/user.model';
import { CandidateProfile } from '../candidates/models/candidate-profile.model';
import { Company } from '../companies/models/company.model';
import { RefreshToken } from './models/refresh-token.model';
import { RegisterDto } from './dto/register.dto';
import { RegisterEmployerDto } from './dto/register-employer.dto';
import { LoginDto } from './dto/login.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User) private readonly userModel: typeof User,
    @InjectModel(CandidateProfile) private readonly candidateModel: typeof CandidateProfile,
    @InjectModel(Company) private readonly companyModel: typeof Company,
    @InjectModel(RefreshToken) private readonly refreshTokenModel: typeof RefreshToken,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const exists = await this.userModel.findOne({ where: { email: dto.email } });
    if (exists) throw new ConflictException('Email already registered');

    const passwordHash = await bcrypt.hash(dto.password, 12);
    const user = await this.userModel.create({
      email: dto.email,
      phone: dto.phone,
      password_hash: passwordHash,
      role: 'candidate',
    } as any);

    await this.candidateModel.create({
      user_id: user.id,
      full_name: dto.fullName,
    } as any);

    const tokens = await this.generateTokens(user);
    return { ...tokens, user: this.sanitizeUser(user) };
  }

  async registerEmployer(dto: RegisterEmployerDto) {
    const exists = await this.userModel.findOne({ where: { email: dto.email } });
    if (exists) throw new ConflictException('Email already registered');

    const passwordHash = await bcrypt.hash(dto.password, 12);
    const user = await this.userModel.create({
      email: dto.email,
      password_hash: passwordHash,
      role: 'employer',
    } as any);

    await this.companyModel.create({
      user_id: user.id,
      name: dto.companyName,
      city: dto.city,
    } as any);

    const tokens = await this.generateTokens(user);
    return { ...tokens, user: this.sanitizeUser(user) };
  }

  async login(dto: LoginDto) {
    const user = await this.userModel.findOne({ where: { email: dto.email } });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const valid = await bcrypt.compare(dto.password, user.password_hash);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    const tokens = await this.generateTokens(user);
    return { ...tokens, user: this.sanitizeUser(user) };
  }

  async refresh(refreshToken: string) {
    const stored = await this.refreshTokenModel.findOne({
      where: { token: refreshToken },
    });

    if (!stored) throw new UnauthorizedException('Invalid refresh token');

    if (stored.expires_at < new Date()) {
      await stored.destroy();
      throw new UnauthorizedException('Refresh token expired');
    }

    let payload: JwtPayload;
    try {
      payload = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET || 'default-refresh-secret',
      });
    } catch {
      await stored.destroy();
      throw new UnauthorizedException('Invalid refresh token');
    }

    const accessToken = this.jwtService.sign(
      { sub: payload.sub, email: payload.email, role: payload.role },
      {
        secret: process.env.JWT_ACCESS_SECRET || 'default-access-secret',
        expiresIn: (process.env.JWT_ACCESS_EXPIRES || '15m') as any,
      },
    );

    return { accessToken };
  }

  async logout(userId: string, refreshToken: string) {
    await this.refreshTokenModel.destroy({
      where: { user_id: userId, token: refreshToken },
    });
    return { success: true };
  }

  async getMe(userId: string) {
    const user = await this.userModel.findByPk(userId, {
      include: [CandidateProfile, Company],
    });
    if (!user) throw new UnauthorizedException('User not found');
    return this.sanitizeUser(user);
  }

  private async generateTokens(user: User) {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = this.jwtService.sign(
      { sub: payload.sub, email: payload.email, role: payload.role },
      {
        secret: process.env.JWT_ACCESS_SECRET || 'default-access-secret',
        expiresIn: (process.env.JWT_ACCESS_EXPIRES || '15m') as any,
      },
    );

    const refreshToken = this.jwtService.sign(
      { sub: payload.sub, email: payload.email, role: payload.role },
      {
        secret: process.env.JWT_REFRESH_SECRET || 'default-refresh-secret',
        expiresIn: (process.env.JWT_REFRESH_EXPIRES || '7d') as any,
      },
    );

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);
    await this.refreshTokenModel.create({
      user_id: user.id,
      token: refreshToken,
      expires_at: expiresAt,
    } as any);

    return { accessToken, refreshToken };
  }

  private sanitizeUser(user: User) {
    const json = user.toJSON() as any;
    const { password_hash, ...safe } = json;
    return safe;
  }
}
