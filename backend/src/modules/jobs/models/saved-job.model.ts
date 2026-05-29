import { Column, Model, Table, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Job } from './job.model';
import { User } from '../../users/models/user.model';

@Table({ tableName: 'saved_jobs', timestamps: true, underscored: true })
export class SavedJob extends Model {
  @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4, primaryKey: true })
  declare id: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: false })
  declare user_id: string;

  @ForeignKey(() => Job)
  @Column({ type: DataType.UUID, allowNull: false })
  declare job_id: string;

  @BelongsTo(() => User)
  user: User;

  @BelongsTo(() => Job)
  job: Job;
}
