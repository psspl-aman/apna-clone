import { Column, Model, Table, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Company } from '../../companies/models/company.model';
import { Job } from '../../jobs/models/job.model';

@Table({ tableName: 'payments', timestamps: true, underscored: true })
export class Payment extends Model {
  @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4, primaryKey: true })
  declare id: string;

  @ForeignKey(() => Company)
  @Column({ type: DataType.UUID, allowNull: false })
  declare company_id: string;

  @BelongsTo(() => Company)
  company: Company;

  @ForeignKey(() => Job)
  @Column({ type: DataType.UUID, allowNull: true })
  declare job_id: string | null;

  @BelongsTo(() => Job)
  job: Job;

  @Column({ type: DataType.STRING(50), allowNull: false })
  declare plan_type: string;

  @Column({ type: DataType.STRING(100) })
  declare plan_label: string;

  /** Base plan price in INR (excl. GST) */
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare amount: number;

  /** 18% GST */
  @Column({ type: DataType.INTEGER, defaultValue: 0 })
  declare gst_amount: number;

  /** Total charged = amount + gst_amount */
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare total_amount: number;

  @Column({ type: DataType.STRING(150) })
  declare razorpay_order_id: string;

  @Column({ type: DataType.STRING(150) })
  declare razorpay_payment_id: string;

  @Column({ type: DataType.ENUM('pending', 'success', 'failed'), defaultValue: 'pending' })
  declare status: string;

  @Column({ type: DataType.DATE })
  declare plan_start_at: Date | null;

  @Column({ type: DataType.DATE })
  declare plan_expires_at: Date | null;
}
