# BACKEND_SKILL.md — NestJS + Sequelize + PostgreSQL

> Read this before starting Phase 0, 1, 2, 3, or 4.

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

## 10. Docker Compose

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
