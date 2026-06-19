import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import type { Response } from 'express';
import { Roles } from '../auth/decorators/roles.decorators';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { SubscriptionActiveGuard } from '../auth/guards/subscription-active.guard';
import { ShiftsService } from './service/shifts.service';
import { AvailableSlotsQueryDto } from './repository/dto/available-slots-query.dto';
import { BusinessShiftsQueryDto } from './repository/dto/business-shifts-query.dto';
import { CreateShiftDto } from './repository/dto/create-shift.dto';
import { ShiftStatsQueryDto } from './repository/dto/shift-stats-query.dto';
import { UpdateShiftStatusDto } from './repository/dto/update-shift-status.dto';

@ApiTags('Shifts')
@Controller('shifts')
export class ShiftsController {
  constructor(private readonly shiftsService: ShiftsService) {}

  @Get('available-slots')
  @ApiOperation({ summary: 'Get available slots success' })
  @ApiResponse({ status: 200, description: 'Get available slots success' })
  @ApiResponse({ status: 404, description: 'Business not found' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async getAvailableSlots(
    @Query() dto: AvailableSlotsQueryDto,
    @Res() res: Response,
  ) {
    const { statusCode, message, data } =
      await this.shiftsService.getAvailableSlots(dto);
    res.status(statusCode).json({
      statusCode,
      message,
      data,
    });
  }

  @Post()
  @ApiOperation({ summary: 'Create shift success' })
  @ApiResponse({ status: 201, description: 'Shift created successfully' })
  @ApiResponse({ status: 404, description: 'Business not found' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async createShift(@Body() dto: CreateShiftDto, @Res() res: Response) {
    const { statusCode, message, data } =
      await this.shiftsService.createShift(dto);
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
  @ApiOperation({ summary: 'Get business shifts success' })
  @ApiParam({ name: 'businessId', type: Number, required: true })
  @ApiResponse({ status: 200, description: 'Get business shifts success' })
  @ApiResponse({ status: 404, description: 'Business not found' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async getBusinessShifts(
    @Param('businessId', ParseIntPipe) businessId: number,
    @Query() query: BusinessShiftsQueryDto,
    @Res() res: Response,
  ) {
    const { statusCode, message, data } =
      await this.shiftsService.getBusinessShifts(businessId, query);
    res.status(statusCode).json({
      statusCode,
      message,
      data,
    });
  }

  @Roles('admin')
  @UseGuards(JwtAuthGuard, RolesGuard, SubscriptionActiveGuard)
  @ApiBearerAuth()
  @Put(':id/status')
  @ApiOperation({ summary: 'Update shift status success' })
  @ApiParam({ name: 'id', type: Number, required: true })
  @ApiResponse({ status: 200, description: 'Shift status updated successfully' })
  @ApiResponse({ status: 404, description: 'Shift not found' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async updateShiftStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateShiftStatusDto,
    @Res() res: Response,
  ) {
    const { statusCode, message, data } =
      await this.shiftsService.updateShiftStatus(id, dto);
    res.status(statusCode).json({
      statusCode,
      message,
      data,
    });
  }

  @Roles('admin')
  @UseGuards(JwtAuthGuard, RolesGuard, SubscriptionActiveGuard)
  @ApiBearerAuth()
  @Get('stats/:businessId')
  @ApiOperation({ summary: 'Get business shift stats success' })
  @ApiParam({ name: 'businessId', type: Number, required: true })
  @ApiQuery({ name: 'month', required: false, type: String })
  @ApiResponse({ status: 200, description: 'Get business shift stats success' })
  @ApiResponse({ status: 404, description: 'Business not found' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async getBusinessShiftStats(
    @Param('businessId', ParseIntPipe) businessId: number,
    @Query() query: ShiftStatsQueryDto,
    @Res() res: Response,
  ) {
    const { statusCode, message, data } =
      await this.shiftsService.getBusinessShiftStats(businessId, query);
    res.status(statusCode).json({
      statusCode,
      message,
      data,
    });
  }
}