import { Column, Model, Table, DataType } from 'sequelize-typescript';

@Table({ tableName: 'categories', timestamps: false, underscored: true })
export class Category extends Model {
  @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
  declare id: number;

  @Column({ type: DataType.STRING(100), allowNull: false, unique: true })
  declare slug: string;

  @Column({ type: DataType.STRING(100), allowNull: false })
  declare label: string;

  @Column({ type: DataType.TEXT })
  declare icon: string;

  @Column({ type: DataType.BOOLEAN, defaultValue: true })
  declare is_active: boolean;
}
