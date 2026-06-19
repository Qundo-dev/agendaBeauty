import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import type { Request, Response } from 'express';
import { Roles } from '../auth/decorators/roles.decorators';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CreateSubscriptionDto } from './repository/dto/create.subscription.dto';
import { SubscriptionsService } from './service/subscriptions.service';

@ApiTags('Subscriptions')
@Controller('subscriptions')
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Roles('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Post()
  @ApiOperation({ summary: 'Link a business to a plan' })
  @ApiResponse({ status: 201, description: 'Subscription created successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Business not found' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async createSubscription(
    @Body() dto: CreateSubscriptionDto,
    @Req() req: Request & { user: { businessId: number } },
    @Res() res: Response,
  ) {
    const { statusCode, message, data } =
      await this.subscriptionsService.createSubscription(
        dto,
        req.user.businessId,
      );
    res.status(statusCode).json({
      statusCode,
      message,
      data,
    });
  }

  @Roles('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Get('business/:businessId')
  @ApiOperation({ summary: 'Verify if the business has an active subscription' })
  @ApiParam({ name: 'businessId', type: Number, required: true })
  @ApiResponse({ status: 200, description: 'Get active subscription success' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Business not found' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async getActiveSubscriptionByBusinessId(
    @Param('businessId', ParseIntPipe) businessId: number,
    @Req() req: Request & { user: { businessId: number } },
    @Res() res: Response,
  ) {
    const { statusCode, message, data } =
      await this.subscriptionsService.getActiveSubscriptionByBusinessId(
        businessId,
        req.user.businessId,
      );
    res.status(statusCode).json({
      statusCode,
      message,
      data,
    });
  }
}