import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import * as crypto from 'crypto';
import { Job } from '../jobs/models/job.model';
import { Company } from '../companies/models/company.model';

// Razorpay is loaded via require since it has no @types
// eslint-disable-next-line @typescript-eslint/no-require-imports
const Razorpay = require('razorpay');

export const PLAN_PRICES: Record<string, number> = {
  classic: 699,
  premium: 1399,
  super_premium: 2799,
};

@Injectable()
export class PaymentsService {
  private razorpay: any;

  constructor(
    @InjectModel(Job) private readonly jobModel: typeof Job,
    @InjectModel(Company) private readonly companyModel: typeof Company,
  ) {
    this.razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID || '',
      key_secret: process.env.RAZORPAY_KEY_SECRET || '',
    });
  }

  async createOrder(plan: string) {
    const amount = PLAN_PRICES[plan];
    if (!amount) throw new BadRequestException('Invalid plan');

    const keyId = process.env.RAZORPAY_KEY_ID || '';
    const isTestMode = !keyId || keyId.startsWith('rzp_test_REPLACE');

    if (isTestMode) {
      // Return mock order for dev/test without real Razorpay keys
      return {
        id: `mock_order_${Date.now()}`,
        amount: amount * 100,
        currency: 'INR',
        plan,
        mock: true,
      };
    }

    const order = await this.razorpay.orders.create({
      amount: amount * 100, // paise
      currency: 'INR',
      receipt: `job_post_${plan}_${Date.now()}`,
    });

    return { ...order, plan, mock: false };
  }

  async verifyAndPublishJob(
    jobData: any,
    companyId: string,
    payment: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string },
  ) {
    const keyId = process.env.RAZORPAY_KEY_ID || '';
    const isMock = !keyId || keyId.startsWith('rzp_test_REPLACE') || payment.razorpay_order_id?.startsWith('mock_');

    if (!isMock) {
      // Verify Razorpay signature
      const body = `${payment.razorpay_order_id}|${payment.razorpay_payment_id}`;
      const expectedSig = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || '')
        .update(body)
        .digest('hex');

      if (expectedSig !== payment.razorpay_signature) {
        throw new BadRequestException('Payment verification failed');
      }
    }

    const job = await this.jobModel.create({
      ...jobData,
      company_id: companyId,
      is_paid: true,
      is_active: true,
      razorpay_payment_id: payment.razorpay_payment_id || 'mock',
    } as any);

    return job;
  }
}
