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
import { CreateEmployeeDto } from './repository/dto/create.employee.dto';
import { UpdateEmployeeDto } from './repository/dto/update.employee.dto';
import { EmployeesService } from './service/employees.service';

@ApiTags('Employees')
@Controller('employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Roles('admin')
  @UseGuards(JwtAuthGuard, RolesGuard, SubscriptionActiveGuard)
  @ApiBearerAuth()
  @Get('list')
  @ApiOperation({ summary: 'List employees success' })
  @ApiResponse({ status: 200, description: 'List employees success' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async listEmployees(
    @Query() options: PaginationRequestListDto,
    @Res() res: Response,
  ) {
    const { statusCode, message, data } =
      await this.employeesService.listEmployees(options);
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
  @ApiOperation({ summary: 'Get employee by ID success' })
  @ApiQuery({ name: 'id', type: Number, required: true })
  @ApiResponse({ status: 200, description: 'Get employee by ID success' })
  @ApiResponse({ status: 404, description: 'Employee not found' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async getEmployeeById(
    @Query('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ) {
    const { statusCode, message, data } =
      await this.employeesService.getEmployeeById(id);
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
  @ApiOperation({ summary: 'Create employee success' })
  @ApiResponse({ status: 201, description: 'Employee created successfully' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async createEmployee(@Body() dto: CreateEmployeeDto, @Res() res: Response) {
    const { statusCode, message, data } =
      await this.employeesService.createEmployee(dto);
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
  @ApiOperation({ summary: 'Update employee success' })
  @ApiQuery({ name: 'id', type: Number, required: true })
  @ApiResponse({ status: 200, description: 'Employee updated successfully' })
  @ApiResponse({ status: 404, description: 'Employee not found' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async updateEmployee(
    @Query('id', ParseIntPipe) id: number,
    @Body() dto: UpdateEmployeeDto,
    @Res() res: Response,
  ) {
    const { statusCode, message, data } =
      await this.employeesService.updateEmployee(id, dto);
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
  @ApiOperation({ summary: 'Delete employee success' })
  @ApiQuery({ name: 'id', type: Number, required: true })
  @ApiResponse({ status: 200, description: 'Employee deleted successfully' })
  @ApiResponse({ status: 404, description: 'Employee not found' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async deleteEmployee(
    @Query('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ) {
    const { statusCode, message, data } =
      await this.employeesService.deleteEmployee(id);
    res.status(statusCode).json({
      statusCode,
      message,
      data,
    });
  }
}