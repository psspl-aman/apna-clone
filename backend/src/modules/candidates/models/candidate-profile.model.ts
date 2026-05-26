import { Column, Model, Table, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { User } from '../../users/models/user.model';

@Table({ tableName: 'candidate_profiles', timestamps: true, underscored: true })
export class CandidateProfile extends Model {
  @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4, primaryKey: true })
  declare id: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: false, unique: true })
  declare user_id: string;

  @BelongsTo(() => User)
  user: User;

  @Column({ type: DataType.STRING(255) })
  declare full_name: string;

  @Column({ type: DataType.TEXT })
  declare resume_url: string;

  @Column({ type: DataType.INTEGER, defaultValue: 0 })
  declare experience: number;

  @Column({ type: DataType.ARRAY(DataType.TEXT), defaultValue: [] })
  declare skills: string[];

  @Column({ type: DataType.STRING(100) })
  declare education: string;

  @Column({ type: DataType.STRING(100) })
  declare city: string;

  @Column({ type: DataType.STRING(20) })
  declare gender: string;

  @Column({ type: DataType.DATEONLY })
  declare dob: string;
}
