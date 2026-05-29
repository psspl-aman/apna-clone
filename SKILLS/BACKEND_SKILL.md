# BACKEND_SKILL.md — NestJS + Sequelize + PostgreSQL

> Read this before starting Phase 0, 1, 2, 3, 4, or 13.

**Last updated: 2026-05-29 (Phase 13)**

---

## 1. Dependency Installation

```bash
cd backend

# Core NestJS + Sequelize
npm install @nestjs/sequelize sequelize sequelize-typescript pg pg-hstore
npm install @nestjs/config @nestjs/jwt @nestjs/passport
npm install passport passport-jwt passport-local
npm install bcrypt class-validator class-transformer
npm install multer @nestjs/platform-express
npm install sequelize-cli

# Dev dependencies
npm install -D @types/passport-jwt @types/passport-local @types/bcrypt
npm install -D @types/multer @types/sequelize
npm install -D sequelize-cli
```

---

## 2. MVC Structure Rules

**ALWAYS follow this pattern:**

```
Controller  →  receives HTTP request, validates DTO, calls Service
Service     →  contains ALL business logic, calls Model methods
Model       →  Sequelize model, defines schema and associations
DTO         →  class-validator decorated input shapes
```

### Controller (ONLY does this):
```typescript
@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Get()
  async findAll(@Query() filterDto: JobFilterDto) {
    const result = await this.jobsService.findAll(filterDto);
    return { success: true, message: 'Jobs fetched', data: result.jobs, meta: result.meta };
  }
}
```

### Service (contains ALL logic):
```typescript
@Injectable()
export class JobsService {
  constructor(
    @InjectModel(Job) private readonly jobModel: typeof Job,
  ) {}

  async findAll(filters: JobFilterDto): Promise<{ jobs: Job[]; meta: PaginationMeta }> {
    const where: WhereOptions = { is_active: true };
    
    if (filters.city) where['city'] = filters.city;
    if (filters.category) where['category'] = filters.category;
    if (filters.keyword) {
      where['title'] = { [Op.iLike]: `%${filters.keyword}%` };
    }

    const { count, rows } = await this.jobModel.findAndCountAll({
      where,
      include: [{ model: Company, attributes: ['name', 'logo_url'] }],
      limit: filters.limit || 10,
      offset: ((filters.page || 1) - 1) * (filters.limit || 10),
      order: [['created_at', 'DESC']],
    });

    return {
      jobs: rows,
      meta: {
        total: count,
        page: filters.page || 1,
        limit: filters.limit || 10,
        totalPages: Math.ceil(count / (filters.limit || 10)),
      },
    };
  }
}
```

---

## 3. Sequelize Model Template

```typescript
// job.model.ts
import { Column, Model, Table, DataType, ForeignKey, BelongsTo, HasMany } from 'sequelize-typescript';
import { Company } from '../companies/models/company.model';
import { Application } from '../applications/models/application.model';

@Table({ tableName: 'jobs', timestamps: true, underscored: true })
export class Job extends Model {
  @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4, primaryKey: true })
  id: string;

  @ForeignKey(() => Company)
  @Column({ type: DataType.UUID, allowNull: false })
  company_id: string;

  @BelongsTo(() => Company)
  company: Company;

  @HasMany(() => Application)
  applications: Application[];

  @Column({ type: DataType.STRING(255), allowNull: false })
  title: string;

  @Column({ type: DataType.TEXT })
  description: string;

  @Column({ type: DataType.STRING(100) })
  category: string;

  @Column({ type: DataType.STRING(100) })
  city: string;

  @Column({
    type: DataType.ENUM('full_time', 'part_time', 'work_from_home', 'night_shift'),
    defaultValue: 'full_time',
  })
  job_type: string;

  @Column({ type: DataType.INTEGER, defaultValue: 0 })
  salary_min: number;

  @Column({ type: DataType.INTEGER })
  salary_max: number;

  @Column({ type: DataType.INTEGER, defaultValue: 0 })
  experience_min: number;

  @Column({ type: DataType.INTEGER })
  experience_max: number;

  @Column({ type: DataType.STRING(50), defaultValue: 'any' })
  gender: string;

  @Column({ type: DataType.STRING(100) })
  education: string;

  @Column({ type: DataType.INTEGER, defaultValue: 1 })
  openings: number;

  @Column({ type: DataType.BOOLEAN, defaultValue: true })
  is_active: boolean;
}
```

---

## 4. DTO Template

```typescript
// job-filter.dto.ts
import { IsOptional, IsString, IsNumber, IsEnum, Min } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class JobFilterDto {
  @IsOptional()
  @IsString()
  keyword?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsEnum(['full_time', 'part_time', 'work_from_home', 'night_shift'])
  job_type?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  salary_min?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  exp_min?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  exp_max?: number;

  @IsOptional()
  @IsEnum(['24h', '3d', '7d', 'all'])
  date_posted?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  limit?: number = 10;
}
```

---

## 5. Global Exception Filter

Create `src/common/filters/http-exception.filter.ts`:
```typescript
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    response.status(status).json({
      success: false,
      message: typeof exceptionResponse === 'object'
        ? (exceptionResponse as any).message
        : exceptionResponse,
      data: null,
    });
  }
}
```

Register globally in `main.ts`:
```typescript
app.useGlobalFilters(new HttpExceptionFilter());
app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
app.setGlobalPrefix('api');
```

---

## 6. Sequelize Database Config

```typescript
// config/database.config.ts
import { SequelizeModuleOptions } from '@nestjs/sequelize';

export const databaseConfig = (): SequelizeModuleOptions => ({
  dialect: 'postgres',
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  autoLoadModels: true,
  synchronize: false,   // NEVER true in prod — use migrations
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
});
```

---

## 7. Module Registration Pattern

```typescript
// jobs.module.ts
@Module({
  imports: [
    SequelizeModule.forFeature([Job, Company, Application]),
  ],
  controllers: [JobsController],
  providers: [JobsService],
  exports: [JobsService],
})
export class JobsModule {}
```

---

## 8. JWT Auth Guard

```typescript
// common/guards/jwt-auth.guard.ts
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }
}

// common/guards/roles.guard.ts
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) return true;

    const { user } = context.switchToHttp().getRequest();
    return requiredRoles.includes(user.role);
  }
}
```

---

## 9. Sequelize CLI Config (`sequelize.config.js`)

```javascript
module.exports = {
  development: {
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME || 'apna_clone',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    migrationStorageTableName: 'sequelize_meta',
  },
};
```

---

## 10. Payments Module (Razorpay) — Phase 13

```bash
npm install razorpay
```

Add to `.env`:
```
RAZORPAY_KEY_ID=rzp_test_REPLACE_WITH_YOUR_KEY
RAZORPAY_KEY_SECRET=REPLACE_WITH_YOUR_SECRET
```

**Mock mode**: If `RAZORPAY_KEY_ID` starts with `rzp_test_REPLACE`, the service returns a fake order and skips signature verification — no real account needed for development.

```typescript
// payments.service.ts
const Razorpay = require('razorpay');

@Injectable()
export class PaymentsService {
  private razorpay: any;

  constructor(@InjectModel(Job) private jobModel: typeof Job) {
    this.razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  }

  async createOrder(plan: string) {
    const prices = { classic: 699, premium: 1399, super_premium: 2799 };
    const amount = prices[plan];
    const isMock = !process.env.RAZORPAY_KEY_ID?.startsWith('rzp_') ||
                   process.env.RAZORPAY_KEY_ID?.includes('REPLACE');
    if (isMock) {
      return { id: `mock_order_${Date.now()}`, amount: amount * 100, mock: true };
    }
    return this.razorpay.orders.create({ amount: amount * 100, currency: 'INR' });
  }

  async verifyAndPublishJob(jobData: any, companyId: string, payment: any) {
    // Verify Razorpay signature (skip for mock)
    if (!payment.razorpay_order_id?.startsWith('mock_')) {
      const body = `${payment.razorpay_order_id}|${payment.razorpay_payment_id}`;
      const expectedSig = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(body).digest('hex');
      if (expectedSig !== payment.razorpay_signature)
        throw new BadRequestException('Payment verification failed');
    }
    return this.jobModel.create({ ...jobData, company_id: companyId, is_paid: true });
  }
}
```

Endpoints:
- `GET  /api/payments/plans` — returns price map (public)
- `POST /api/payments/create-order` — creates Razorpay order (employer only)
- `POST /api/payments/publish-job` — verifies payment + creates job (employer only)

---

## 11. Advanced Job Fields (Phase 13 Migration)

New columns added to `jobs` table via migration `20260529200000-add-advanced-job-fields`:

```typescript
// In Job model
@Column({ type: DataType.STRING(50) }) declare work_location_type: string; // 'work_from_office'|'work_from_home'|'field_job'
@Column({ type: DataType.STRING(50) }) declare pay_type: string;           // 'fixed_only'|'fixed_incentive'|'incentive_only'
@Column({ type: DataType.ARRAY(DataType.TEXT), defaultValue: [] }) declare perks: string[];
@Column({ type: DataType.BOOLEAN, defaultValue: false }) declare has_joining_fee: boolean;
@Column({ type: DataType.BOOLEAN, defaultValue: false }) declare is_night_shift: boolean;
@Column({ type: DataType.STRING(50) }) declare english_level: string;    // 'no_english'|'basic_english'|'good_english'
@Column({ type: DataType.STRING(50) }) declare experience_type: string;  // 'any'|'experienced_only'|'fresher_only'
@Column({ type: DataType.BOOLEAN, defaultValue: false }) declare is_walkin: boolean;
@Column({ type: DataType.STRING(100) }) declare contact_preference: string;
@Column({ type: DataType.STRING(50) }) declare plan_type: string;         // 'classic'|'premium'|'super_premium'
@Column({ type: DataType.BOOLEAN, defaultValue: false }) declare is_paid: boolean;
@Column({ type: DataType.STRING(255) }) declare razorpay_payment_id: string;
```

Run migration: `DB_PASSWORD=<pwd> npx sequelize-cli db:migrate`

---

## 12. Docker Compose

```yaml
version: '3.8'
services:
  postgres:
    image: postgres:15-alpine
    container_name: apna_postgres
    environment:
      POSTGRES_DB: apna_clone
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
    ports:
      - '5432:5432'
    volumes:
      - pgdata:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    container_name: apna_redis
    ports:
      - '6379:6379'

volumes:
  pgdata:
```

Run: `docker-compose up -d`
