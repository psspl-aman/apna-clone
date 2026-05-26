# AUTH_SKILL.md — JWT Auth with Refresh Tokens (NestJS)

> Read this before starting Phase 2 and Phase 6.

---

## 1. Auth Flow

```
REGISTER:
  POST /api/auth/register
  → validate email unique
  → hash password (bcrypt, rounds=12)
  → create user record
  → create candidate/company profile
  → return { accessToken, refreshToken, user }

LOGIN:
  POST /api/auth/login
  → find user by email
  → compare password hash
  → generate access token (15m)
  → generate refresh token (7d) + store in DB
  → return { accessToken, refreshToken, user }

REFRESH:
  POST /api/auth/refresh
  → validate refresh token exists in DB
  → verify JWT signature
  → check not expired
  → generate new access token
  → return { accessToken }

LOGOUT:
  POST /api/auth/logout (protected)
  → delete refresh token from DB
  → return { success: true }
```

---

## 2. Auth Module Structure

```
backend/src/modules/auth/
├── auth.controller.ts
├── auth.service.ts
├── auth.module.ts
├── dto/
│   ├── register.dto.ts
│   ├── register-employer.dto.ts
│   └── login.dto.ts
├── strategies/
│   └── jwt.strategy.ts
└── interfaces/
    └── jwt-payload.interface.ts
```

---

## 3. JWT Strategy

```typescript
// strategies/jwt.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

export interface JwtPayload {
  sub: string;    // user ID
  email: string;
  role: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_ACCESS_SECRET,
    });
  }

  async validate(payload: JwtPayload) {
    return {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
    };
  }
}
```

---

## 4. Auth Service

```typescript
@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User) private userModel: typeof User,
    @InjectModel(CandidateProfile) private candidateModel: typeof CandidateProfile,
    @InjectModel(Company) private companyModel: typeof Company,
    @InjectModel(RefreshToken) private refreshTokenModel: typeof RefreshToken,
    private jwtService: JwtService,
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
    });

    await this.candidateModel.create({
      user_id: user.id,
      full_name: dto.fullName,
    });

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

  private async generateTokens(user: User) {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: process.env.JWT_ACCESS_EXPIRES,
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: process.env.JWT_REFRESH_EXPIRES,
    });

    // Store refresh token
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);
    await this.refreshTokenModel.create({
      user_id: user.id,
      token: refreshToken,
      expires_at: expiresAt,
    });

    return { accessToken, refreshToken };
  }

  async refresh(refreshToken: string) {
    const stored = await this.refreshTokenModel.findOne({
      where: { token: refreshToken },
      include: [{ model: User }],
    });

    if (!stored || stored.expires_at < new Date()) {
      await stored?.destroy();
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    let payload: JwtPayload;
    try {
      payload = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });
    } catch {
      await stored.destroy();
      throw new UnauthorizedException('Invalid refresh token');
    }

    const accessToken = this.jwtService.sign(
      { sub: payload.sub, email: payload.email, role: payload.role },
      { secret: process.env.JWT_ACCESS_SECRET, expiresIn: process.env.JWT_ACCESS_EXPIRES }
    );

    return { accessToken };
  }

  async logout(userId: string, refreshToken: string) {
    await this.refreshTokenModel.destroy({
      where: { user_id: userId, token: refreshToken },
    });
    return { success: true };
  }

  private sanitizeUser(user: User) {
    const { password_hash, ...safe } = user.toJSON();
    return safe;
  }
}
```

---

## 5. Register DTOs

```typescript
// register.dto.ts
import { IsEmail, IsString, MinLength, IsOptional, Matches } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  fullName: string;

  @IsOptional()
  @Matches(/^[6-9]\d{9}$/, { message: 'Invalid Indian phone number' })
  phone?: string;
}

// login.dto.ts
export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}

// register-employer.dto.ts
export class RegisterEmployerDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  companyName: string;

  @IsOptional()
  @IsString()
  city?: string;
}
```

---

## 6. CurrentUser Decorator

```typescript
// common/decorators/current-user.decorator.ts
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;
    return data ? user?.[data] : user;
  },
);
```

Usage in controller:
```typescript
@Get('me')
@UseGuards(JwtAuthGuard)
getMe(@CurrentUser() user: any) {
  return { success: true, data: user, message: 'Profile fetched' };
}
```

---

## 7. Frontend Auth Slice

```typescript
// src/features/auth/authSlice.ts
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

// Thunks to implement:
export const loginUser = createAsyncThunk('auth/login', async (dto: LoginDto) => {
  const res = await authService.login(dto);
  localStorage.setItem('accessToken', res.data.accessToken);
  localStorage.setItem('refreshToken', res.data.refreshToken);
  return res.data.user;
});

export const logoutUser = createAsyncThunk('auth/logout', async (_, { dispatch }) => {
  await authService.logout();
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
});

export const loadCurrentUser = createAsyncThunk('auth/me', async () => {
  const res = await authService.getMe();
  return res.data;
});
```
