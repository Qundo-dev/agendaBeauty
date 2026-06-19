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
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import type { Response } from 'express';
import { PaginationRequestListDto } from '../../helpers/pagination-request-list.dto';
import { Roles } from '../auth/decorators/roles.decorators';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CreateUserDto } from './repository/dto/create.user.dto';
import { UpdateUserDto } from './repository/dto/update.user.dto';
import { UsersService } from './service/users.service';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Roles('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Post('create')
  @ApiOperation({ summary: 'Create user as cliente' })
  @ApiResponse({ status: 201, description: 'User created successfully' })
  @ApiResponse({ status: 409, description: 'Conflict creating user' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async createUser(@Body() dto: CreateUserDto, @Res() res: Response) {
    const { statusCode, message, data } = await this.usersService.createUser(dto);
    res.status(statusCode).json({
      statusCode,
      message,
      data,
    });
  }

  @Roles('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Get('list')
  @ApiOperation({ summary: 'List users success' })
  @ApiResponse({ status: 200, description: 'List users success' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async listUsers(
    @Query() options: PaginationRequestListDto,
    @Res() res: Response,
  ) {
    const { statusCode, message, data } = await this.usersService.listUsers(options);
    res.status(statusCode).json({
      statusCode,
      message,
      data,
    });
  }

  @Roles('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Get('byid')
  @ApiOperation({ summary: 'Get user by ID success' })
  @ApiQuery({ name: 'id', type: Number, required: true })
  @ApiResponse({ status: 200, description: 'Get user by ID success' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async getUserById(
    @Query('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ) {
    const { statusCode, message, data } = await this.usersService.getUserById(id);
    res.status(statusCode).json({
      statusCode,
      message,
      data,
    });
  }

  @Roles('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Put('update')
  @ApiOperation({ summary: 'Update user success' })
  @ApiQuery({ name: 'id', type: Number, required: true })
  @ApiResponse({ status: 200, description: 'User updated successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async updateUser(
    @Query('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUserDto,
    @Res() res: Response,
  ) {
    const { statusCode, message, data } = await this.usersService.updateUser(id, dto);
    res.status(statusCode).json({
      statusCode,
      message,
      data,
    });
  }

  @Roles('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Delete('delete')
  @ApiOperation({ summary: 'Delete user success' })
  @ApiQuery({ name: 'id', type: Number, required: true })
  @ApiResponse({ status: 200, description: 'User deleted successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async deleteUser(
    @Query('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ) {
    const { statusCode, message, data } = await this.usersService.deleteUser(id);
    res.status(statusCode).json({
      statusCode,
      message,
      data,
    });
  }
}