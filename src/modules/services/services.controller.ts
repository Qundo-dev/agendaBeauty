import {
  Body,
  Controller,
  Delete,
  Get,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import type { Response } from 'express';
import { Roles } from '../auth/decorators/roles.decorators';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { SubscriptionActiveGuard } from '../auth/guards/subscription-active.guard';
import { PaginationRequestListDto } from '../../helpers/pagination-request-list.dto';
import { CreateServiceDto } from './repository/dto/create.service.dto';
import { UpdateServiceDto } from './repository/dto/update.service.dto';
import { ServicesService } from './service/services.service';

@ApiTags('Services')
@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Roles('admin')
  @UseGuards(JwtAuthGuard, RolesGuard, SubscriptionActiveGuard)
  @ApiBearerAuth()
  @Get('list')
  @ApiOperation({ summary: 'List services success' })
  @ApiResponse({ status: 200, description: 'List services success' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async listServices(
    @Query() options: PaginationRequestListDto,
    @Res() res: Response,
  ) {
    const { statusCode, message, data } =
      await this.servicesService.listServices(options);
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
  @ApiOperation({ summary: 'Get service by ID success' })
  @ApiQuery({ name: 'id', type: Number, required: true })
  @ApiResponse({ status: 200, description: 'Get service by ID success' })
  @ApiResponse({ status: 404, description: 'Service not found' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async getServiceById(
    @Query('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ) {
    const { statusCode, message, data } =
      await this.servicesService.getServiceById(id);
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
  @ApiOperation({ summary: 'Create service success' })
  @ApiResponse({ status: 201, description: 'Service created successfully' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async createService(@Body() dto: CreateServiceDto, @Res() res: Response) {
    const { statusCode, message, data } =
      await this.servicesService.createService(dto);
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
  @ApiOperation({ summary: 'Update service success' })
  @ApiQuery({ name: 'id', type: Number, required: true })
  @ApiResponse({ status: 200, description: 'Service updated successfully' })
  @ApiResponse({ status: 404, description: 'Service not found' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async updateService(
    @Query('id', ParseIntPipe) id: number,
    @Body() dto: UpdateServiceDto,
    @Res() res: Response,
  ) {
    const { statusCode, message, data } =
      await this.servicesService.updateService(id, dto);
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
  @ApiOperation({ summary: 'Delete service success' })
  @ApiQuery({ name: 'id', type: Number, required: true })
  @ApiResponse({ status: 200, description: 'Service deleted successfully' })
  @ApiResponse({ status: 404, description: 'Service not found' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async deleteService(
    @Query('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ) {
    const { statusCode, message, data } =
      await this.servicesService.deleteService(id);
    res.status(statusCode).json({
      statusCode,
      message,
      data,
    });
  }
}