import { Column, Model, Table, DataType, ForeignKey, BelongsTo, HasMany } from 'sequelize-typescript';
import { Company } from '../../companies/models/company.model';
import { Application } from '../../applications/models/application.model';

@Table({ tableName: 'jobs', timestamps: true, underscored: true })
export class Job extends Model {
  @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4, primaryKey: true })
  declare id: string;

  @ForeignKey(() => Company)
  @Column({ type: DataType.UUID, allowNull: false })
  declare company_id: string;

  @BelongsTo(() => Company)
  company: Company;

  @HasMany(() => Application)
  applications: Application[];

  @Column({ type: DataType.STRING(255), allowNull: false })
  declare title: string;

  @Column({ type: DataType.TEXT })
  declare description: string;

  @Column({ type: DataType.STRING(100) })
  declare category: string;

  @Column({ type: DataType.STRING(100) })
  declare department: string;

  @Column({ type: DataType.STRING(100) })
  declare city: string;

  @Column({ type: DataType.ENUM('full_time', 'part_time', 'work_from_home', 'night_shift') })
  declare job_type: string;

  @Column({ type: DataType.INTEGER, defaultValue: 0 })
  declare salary_min: number;

  @Column({ type: DataType.INTEGER })
  declare salary_max: number;

  @Column({ type: DataType.INTEGER, defaultValue: 0 })
  declare experience_min: number;

  @Column({ type: DataType.INTEGER })
  declare experience_max: number;

  @Column({ type: DataType.STRING(100) })
  declare education: string;

  @Column({ type: DataType.STRING(20), defaultValue: 'any' })
  declare gender: string;

  @Column({ type: DataType.INTEGER, defaultValue: 1 })
  declare openings: number;

  @Column({ type: DataType.BOOLEAN, defaultValue: true })
  declare is_active: boolean;
}
