import { Column, Model, Table, DataType, HasOne } from 'sequelize-typescript';
import { CandidateProfile } from '../../candidates/models/candidate-profile.model';
import { Company } from '../../companies/models/company.model';
import { RefreshToken } from '../../auth/models/refresh-token.model';

@Table({ tableName: 'users', timestamps: true, underscored: true })
export class User extends Model {
  @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4, primaryKey: true })
  declare id: string;

  @Column({ type: DataType.STRING(255), allowNull: false, unique: true })
  declare email: string;

  @Column({ type: DataType.STRING(15), unique: true })
  declare phone: string;

  @Column({ type: DataType.STRING(255), allowNull: false })
  declare password_hash: string;

  @Column({ type: DataType.STRING(20), allowNull: false })
  declare role: string;

  @Column({ type: DataType.BOOLEAN, defaultValue: true })
  declare is_active: boolean;

  @HasOne(() => CandidateProfile)
  candidateProfile: CandidateProfile;

  @HasOne(() => Company)
  company: Company;

  @HasOne(() => RefreshToken)
  refreshToken: RefreshToken;
}
