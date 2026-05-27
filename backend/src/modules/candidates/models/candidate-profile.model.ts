import { Column, Model, Table, DataType, ForeignKey, BelongsTo, HasMany } from 'sequelize-typescript';
import { User } from '../../users/models/user.model';
import { WorkExperience } from './work-experience.model';
import { Education } from './education.model';
import { Certification } from './certification.model';

@Table({ tableName: 'candidate_profiles', timestamps: true, underscored: true })
export class CandidateProfile extends Model {
  @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4, primaryKey: true })
  declare id: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: false, unique: true })
  declare user_id: string;

  @BelongsTo(() => User)
  user: User;

  @HasMany(() => WorkExperience)
  workExperiences: WorkExperience[];

  @HasMany(() => Education)
  educations: Education[];

  @HasMany(() => Certification)
  certifications: Certification[];

  @Column({ type: DataType.STRING(255) })
  declare full_name: string;

  @Column({ type: DataType.TEXT })
  declare resume_url: string;

  @Column({ type: DataType.STRING(255) })
  declare resume_file_name: string;

  @Column({ type: DataType.DATE })
  declare resume_updated_at: string;

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

  @Column({ type: DataType.DATEONLY })
  declare date_of_birth: string;

  @Column({ type: DataType.STRING(100) })
  declare home_town: string;

  @Column({ type: DataType.STRING(100) })
  declare current_location: string;

  @Column({ type: DataType.INTEGER })
  declare current_salary: number;

  @Column({ type: DataType.INTEGER })
  declare total_experience: number;

  @Column({ type: DataType.STRING(20) })
  declare spoken_english_level: string;

  @Column({ type: DataType.STRING(50) })
  declare school_medium: string;

  @Column({ type: DataType.STRING(100) })
  declare highest_education: string;

  @Column({ type: DataType.ARRAY(DataType.TEXT), defaultValue: [] })
  declare preferred_job_titles: string[];

  @Column({ type: DataType.ARRAY(DataType.TEXT), defaultValue: [] })
  declare preferred_locations: string[];

  @Column({ type: DataType.JSONB, defaultValue: [] })
  declare languages: { name: string; level: string }[];

  @Column({ type: DataType.INTEGER, defaultValue: 0 })
  declare profile_completion: number;
}
