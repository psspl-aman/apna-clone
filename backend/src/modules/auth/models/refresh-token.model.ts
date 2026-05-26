import { Column, Model, Table, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { User } from '../../users/models/user.model';

@Table({ tableName: 'refresh_tokens', timestamps: true, underscored: true })
export class RefreshToken extends Model {
  @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4, primaryKey: true })
  declare id: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: false })
  declare user_id: string;

  @BelongsTo(() => User)
  user: User;

  @Column({ type: DataType.TEXT, allowNull: false, unique: true })
  declare token: string;

  @Column({ type: DataType.DATE, allowNull: false })
  declare expires_at: Date;
}
