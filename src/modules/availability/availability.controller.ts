import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
  Res,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import type { Response } from 'express';
import { Roles } from '../auth/decorators/roles.decorators';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { SubscriptionActiveGuard } from '../auth/guards/subscription-active.guard';
import { BulkAvailabilityDto } from './repository/dto/bulk-availability.dto';
import { UpdateAvailabilityDto } from './repository/dto/update.availability.dto';
import { AvailabilityService } from './service/availability.service';

@ApiTags('Availability')
@Controller('availability')
export class AvailabilityController {
  constructor(private readonly availabilityService: AvailabilityService) {}

  @Roles('admin')
  @UseGuards(JwtAuthGuard, RolesGuard, SubscriptionActiveGuard)
  @ApiBearerAuth()
  @Post('bulk')
  @ApiOperation({ summary: 'Configure business availability in bulk' })
  @ApiResponse({ status: 201, description: 'Availability configured successfully' })
  @ApiResponse({ status: 404, description: 'Business not found' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async bulkUpsertAvailability(
    @Body() dto: BulkAvailabilityDto,
    @Res() res: Response,
  ) {
    const { statusCode, message, data } =
      await this.availabilityService.bulkUpsertAvailability(dto);
    res.status(statusCode).json({
      statusCode,
      message,
      data,
    });
  }

  @Roles('admin')
  @UseGuards(JwtAuthGuard, RolesGuard, SubscriptionActiveGuard)
  @ApiBearerAuth()
  @Get('business/:businessId')
  @ApiOperation({ summary: 'Get availability by business success' })
  @ApiParam({ name: 'businessId', type: Number, required: true })
  @ApiResponse({ status: 200, description: 'Get availability by business success' })
  @ApiResponse({ status: 404, description: 'Business not found' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async getAvailabilityByBusinessId(
    @Param('businessId', ParseIntPipe) businessId: number,
    @Res() res: Response,
  ) {
    const { statusCode, message, data } =
      await this.availabilityService.getAvailabilityByBusinessId(businessId);
    res.status(statusCode).json({
      statusCode,
      message,
      data,
    });
  }

  @Roles('admin')
  @UseGuards(JwtAuthGuard, RolesGuard, SubscriptionActiveGuard)
  @ApiBearerAuth()
  @Put(':id')
  @ApiOperation({ summary: 'Update availability success' })
  @ApiParam({ name: 'id', type: Number, required: true })
  @ApiResponse({ status: 200, description: 'Availability updated successfully' })
  @ApiResponse({ status: 404, description: 'Availability not found' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async updateAvailability(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateAvailabilityDto,
    @Res() res: Response,
  ) {
    const { statusCode, message, data } =
      await this.availabilityService.updateAvailability(id, dto);
    res.status(statusCode).json({
      statusCode,
      message,
      data,
    });
  }
}