import { Column, Model, Table, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { CandidateProfile } from './candidate-profile.model';

@Table({ tableName: 'certifications', timestamps: true, underscored: true })
export class Certification extends Model {
  @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4, primaryKey: true })
  declare id: string;

  @ForeignKey(() => CandidateProfile)
  @Column({ type: DataType.UUID, allowNull: false })
  declare candidate_id: string;

  @BelongsTo(() => CandidateProfile)
  candidateProfile: CandidateProfile;

  @Column({ type: DataType.STRING(255), allowNull: false })
  declare name: string;

  @Column({ type: DataType.STRING(255) })
  declare issuing_org: string;

  @Column({ type: DataType.DATEONLY })
  declare issue_date: string;

  @Column({ type: DataType.DATEONLY })
  declare expiry_date: string;

  @Column({ type: DataType.TEXT })
  declare credential_url: string;
}
