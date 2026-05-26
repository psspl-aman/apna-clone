import { Column, Model, Table, DataType, ForeignKey, BelongsTo, HasMany } from 'sequelize-typescript';
import { User } from '../../users/models/user.model';
import { Job } from '../../jobs/models/job.model';

@Table({ tableName: 'companies', timestamps: true, underscored: true })
export class Company extends Model {
  @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4, primaryKey: true })
  declare id: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: false, unique: true })
  declare user_id: string;

  @BelongsTo(() => User)
  user: User;

  @HasMany(() => Job)
  jobs: Job[];

  @Column({ type: DataType.STRING(255), allowNull: false })
  declare name: string;

  @Column({ type: DataType.TEXT })
  declare logo_url: string;

  @Column({ type: DataType.TEXT })
  declare description: string;

  @Column({ type: DataType.TEXT })
  declare website: string;

  @Column({ type: DataType.STRING(100) })
  declare city: string;

  @Column({ type: DataType.STRING(50) })
  declare employee_size: string;

  @Column({ type: DataType.STRING(100) })
  declare industry: string;
}
