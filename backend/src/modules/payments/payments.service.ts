import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import * as crypto from 'crypto';
import { Job } from '../jobs/models/job.model';
import { Company } from '../companies/models/company.model';
import { Payment } from './models/payment.model';

// Razorpay is loaded via require since it has no @types
// eslint-disable-next-line @typescript-eslint/no-require-imports
const Razorpay = require('razorpay');

export const PLAN_PRICES: Record<string, number> = {
  classic: 699,
  premium: 1399,
  super_premium: 2799,
};

const PLAN_LABELS: Record<string, string> = {
  classic: 'Classic Job',
  premium: 'Premium Job',
  super_premium: 'Super Premium Job',
};

/** Active duration for any plan: 15 days */
const PLAN_DAYS = 15;

@Injectable()
export class PaymentsService {
  private razorpay: any;

  constructor(
    @InjectModel(Job) private readonly jobModel: typeof Job,
    @InjectModel(Company) private readonly companyModel: typeof Company,
    @InjectModel(Payment) private readonly paymentModel: typeof Payment,
  ) {
    this.razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID || '',
      key_secret: process.env.RAZORPAY_KEY_SECRET || '',
    });
  }

  async createOrder(plan: string, companyId: string, jobId?: string) {
    const baseAmount = PLAN_PRICES[plan];
    if (!baseAmount) throw new BadRequestException('Invalid plan');

    const gst = Math.round(baseAmount * 0.18);
    const total = baseAmount + gst;
    const planLabel = PLAN_LABELS[plan] || plan;

    const keyId = process.env.RAZORPAY_KEY_ID || '';
    const isTestMode = !keyId || keyId.startsWith('rzp_test_REPLACE');

    let orderId: string;
    let mock = false;

    if (isTestMode) {
      orderId = `mock_order_${Date.now()}`;
      mock = true;
    } else {
      const order = await this.razorpay.orders.create({
        amount: total * 100,
        currency: 'INR',
        receipt: `job_post_${plan}_${Date.now()}`,
      });
      orderId = order.id;
    }

    // Record a pending payment entry
    await this.paymentModel.create({
      company_id: companyId,
      job_id: jobId || null,
      plan_type: plan,
      plan_label: planLabel,
      amount: baseAmount,
      gst_amount: gst,
      total_amount: total,
      razorpay_order_id: orderId,
      status: 'pending',
    } as any);

    return { id: orderId, amount: total * 100, currency: 'INR', plan, mock };
  }

  async verifyAndPublishJob(
    jobId: string | undefined,
    jobData: any,
    companyId: string,
    payment: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string },
  ) {
    const keyId = process.env.RAZORPAY_KEY_ID || '';
    const isMock =
      !keyId ||
      keyId.startsWith('rzp_test_REPLACE') ||
      payment.razorpay_order_id?.startsWith('mock_');

    if (!isMock) {
      const body = `${payment.razorpay_order_id}|${payment.razorpay_payment_id}`;
      const expectedSig = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || '')
        .update(body)
        .digest('hex');

      if (expectedSig !== payment.razorpay_signature) {
        // Mark payment as failed
        await this.paymentModel.update(
          { status: 'failed' },
          { where: { razorpay_order_id: payment.razorpay_order_id } },
        );
        throw new BadRequestException('Payment verification failed');
      }
    }

    // Update existing draft job OR create new
    let job: Job;
    if (jobId) {
      const existing = await this.jobModel.findByPk(jobId);
      if (existing) {
        await existing.update({
          ...(jobData || {}),
          is_paid: true,
          is_active: true,
          razorpay_payment_id: payment.razorpay_payment_id || 'mock',
        });
        job = existing;
      } else {
        job = await this.jobModel.create({
          ...(jobData || {}),
          company_id: companyId,
          is_paid: true,
          is_active: true,
          razorpay_payment_id: payment.razorpay_payment_id || 'mock',
        } as any);
      }
    } else {
      job = await this.jobModel.create({
        ...(jobData || {}),
        company_id: companyId,
        is_paid: true,
        is_active: true,
        razorpay_payment_id: payment.razorpay_payment_id || 'mock',
      } as any);
    }

    // Calculate plan validity
    const startAt = new Date();
    const expiresAt = new Date(startAt.getTime() + PLAN_DAYS * 24 * 60 * 60 * 1000);

    // Mark payment as success and attach job
    await this.paymentModel.update(
      {
        job_id: job.id,
        razorpay_payment_id: payment.razorpay_payment_id || 'mock',
        status: 'success',
        plan_start_at: startAt,
        plan_expires_at: expiresAt,
      },
      { where: { razorpay_order_id: payment.razorpay_order_id } },
    );

    return job;
  }

  async getHistory(companyId: string) {
    return this.paymentModel.findAll({
      where: { company_id: companyId },
      order: [['created_at', 'DESC']],
    });
  }
}
