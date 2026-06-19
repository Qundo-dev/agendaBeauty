import {
  ParseIntPipe,
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import type { Response } from 'express';
import { PaginationRequestListDto } from '../../helpers/pagination-request-list.dto';
import { Roles } from '../auth/decorators/roles.decorators';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { SubscriptionActiveGuard } from '../auth/guards/subscription-active.guard';
import { BusinessService } from './service/business.service';
import { CreateBusinessDto } from './repository/dto/create.business.dto';
import { UpdateBusinessDto } from './repository/dto/update.business.dto';

@ApiTags('Business')
@Controller('business')
export class BusinessController {
  constructor(private readonly businessService: BusinessService) {}

  @Roles('admin')
  @UseGuards(JwtAuthGuard, RolesGuard, SubscriptionActiveGuard)
  @ApiBearerAuth()
  @Get('list')
  @ApiOperation({ summary: 'List business success' })
  @ApiResponse({ status: 200, description: 'List business success' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async listBusiness(
    @Query() options: PaginationRequestListDto,
    @Res() res: Response,
  ) {
    const { statusCode, message, data } =
      await this.businessService.listBusiness(options);
    res.status(statusCode).json({
      statusCode,
      message,
      data,
    });
  }

  @Roles('admin')
  @UseGuards(JwtAuthGuard, RolesGuard, SubscriptionActiveGuard)
  @ApiBearerAuth()
  @Get('byid')
  @ApiOperation({ summary: 'Get business by ID success' })
  @ApiQuery({ name: 'id', type: Number, required: true })
  @ApiResponse({ status: 200, description: 'Get business by ID success' })
  @ApiResponse({ status: 404, description: 'Business not found' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async getBusinessById(
    @Query('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ) {
    const { statusCode, message, data } =
      await this.businessService.getBusinessById(id);
    res.status(statusCode).json({
      statusCode,
      message,
      data,
    });
  }

  @Roles('admin')
  @UseGuards(JwtAuthGuard, RolesGuard, SubscriptionActiveGuard)
  @ApiBearerAuth()
  @Post('create')
  @ApiOperation({ summary: 'Create business success' })
  @ApiResponse({ status: 201, description: 'Business created successfully' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async createBusiness(
    @Body() dto: CreateBusinessDto,
    @Res() res: Response,
  ) {
    const { statusCode, message, data } =
      await this.businessService.createBusiness(dto);
    res.status(statusCode).json({
      statusCode,
      message,
      data,
    });
  }

  @Roles('admin')
  @UseGuards(JwtAuthGuard, RolesGuard, SubscriptionActiveGuard)
  @ApiBearerAuth()
  @Put('update')
  @ApiOperation({ summary: 'Update business success' })
  @ApiQuery({ name: 'id', type: Number, required: true })
  @ApiResponse({ status: 200, description: 'Business updated successfully' })
  @ApiResponse({ status: 404, description: 'Business not found' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async updateBusiness(
    @Query('id', ParseIntPipe) id: number,
    @Body() dto: UpdateBusinessDto,
    @Res() res: Response,
  ) {
    const { statusCode, message, data } =
      await this.businessService.updateBusiness(id, dto);
    res.status(statusCode).json({
      statusCode,
      message,
      data,
    });
  }

  @Roles('admin')
  @UseGuards(JwtAuthGuard, RolesGuard, SubscriptionActiveGuard)
  @ApiBearerAuth()
  @Delete('delete')
  @ApiOperation({ summary: 'Delete business success' })
  @ApiQuery({ name: 'id', type: Number, required: true })
  @ApiResponse({ status: 200, description: 'Business deleted successfully' })
  @ApiResponse({ status: 404, description: 'Business not found' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async deleteBusiness(
    @Query('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ) {
    const { statusCode, message, data } =
      await this.businessService.deleteBusiness(id);
    res.status(statusCode).json({
      statusCode,
      message,
      data,
    });
  }
}