import { Column, Model, Table, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Job } from '../../jobs/models/job.model';
import { CandidateProfile } from '../../candidates/models/candidate-profile.model';

@Table({ tableName: 'applications', timestamps: true, underscored: true })
export class Application extends Model {
  @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4, primaryKey: true })
  declare id: string;

  @ForeignKey(() => Job)
  @Column({ type: DataType.UUID, allowNull: false })
  declare job_id: string;

  @BelongsTo(() => Job)
  job: Job;

  @ForeignKey(() => CandidateProfile)
  @Column({ type: DataType.UUID, allowNull: false })
  declare candidate_id: string;

  @BelongsTo(() => CandidateProfile)
  candidate: CandidateProfile;

  @Column({ type: DataType.STRING(50), defaultValue: 'applied' })
  declare status: string;

  @Column({ type: DataType.DATE, allowNull: false })
  declare applied_at: Date;
}
