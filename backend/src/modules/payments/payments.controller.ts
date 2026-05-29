import { Controller, Post, Body, UseGuards, Get } from '@nestjs/common';
import { PaymentsService, PLAN_PRICES } from './payments.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  /** Returns plan metadata (prices) */
  @Get('plans')
  getPlans() {
    return {
      success: true,
      message: 'Plans fetched',
      data: PLAN_PRICES,
    };
  }

  /** Create a Razorpay order for a job posting plan */
  @Post('create-order')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('employer')
  async createOrder(@Body('plan') plan: string) {
    const order = await this.paymentsService.createOrder(plan);
    return { success: true, message: 'Order created', data: order };
  }

  /** Verify payment and publish the job */
  @Post('publish-job')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('employer')
  async publishJob(
    @Body() body: { jobData: any; payment: any },
    @CurrentUser() user: any,
  ) {
    const job = await this.paymentsService.verifyAndPublishJob(
      body.jobData,
      user.companyId,
      body.payment,
    );
    return { success: true, message: 'Job published successfully', data: job };
  }
}
