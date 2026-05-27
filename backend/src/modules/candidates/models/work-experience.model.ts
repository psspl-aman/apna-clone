import { Column, Model, Table, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { CandidateProfile } from './candidate-profile.model';

@Table({ tableName: 'work_experiences', timestamps: true, underscored: true })
export class WorkExperience extends Model {
  @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4, primaryKey: true })
  declare id: string;

  @ForeignKey(() => CandidateProfile)
  @Column({ type: DataType.UUID, allowNull: false })
  declare candidate_id: string;

  @BelongsTo(() => CandidateProfile)
  candidateProfile: CandidateProfile;

  @Column({ type: DataType.STRING(255), allowNull: false })
  declare job_title: string;

  @Column({ type: DataType.STRING(255), allowNull: false })
  declare company_name: string;

  @Column({ type: DataType.ARRAY(DataType.TEXT), defaultValue: [] })
  declare job_roles: string[];

  @Column({ type: DataType.STRING(100) })
  declare industry: string;

  @Column({ type: DataType.TEXT })
  declare description: string;

  @Column({ type: DataType.ARRAY(DataType.TEXT), defaultValue: [] })
  declare skills: string[];

  @Column({ type: DataType.DATEONLY })
  declare start_date: string;

  @Column({ type: DataType.DATEONLY })
  declare end_date: string;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  declare is_current: boolean;
}
