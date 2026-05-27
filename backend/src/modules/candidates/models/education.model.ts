import { Column, Model, Table, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { CandidateProfile } from './candidate-profile.model';

@Table({ tableName: 'educations', timestamps: true, underscored: true })
export class Education extends Model {
  @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4, primaryKey: true })
  declare id: string;

  @ForeignKey(() => CandidateProfile)
  @Column({ type: DataType.UUID, allowNull: false })
  declare candidate_id: string;

  @BelongsTo(() => CandidateProfile)
  candidateProfile: CandidateProfile;

  @Column({ type: DataType.STRING(255) })
  declare degree: string;

  @Column({ type: DataType.STRING(255) })
  declare field_of_study: string;

  @Column({ type: DataType.STRING(255) })
  declare institution: string;

  @Column({ type: DataType.STRING(50) })
  declare education_level: string;

  @Column({ type: DataType.INTEGER })
  declare batch_year: number;
}
