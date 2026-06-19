import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register user (first admin, rest cliente)' })
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  @ApiResponse({ status: 409, description: 'User already exists' })
  async register(@Body() dto: RegisterDto, @Res() res: Response) {
    const data = await this.authService.register(dto);
    res.status(201).json({
      statusCode: 201,
      message: data.message,
      data,
    });
  }

  @Post('login')
  @ApiOperation({ summary: 'Login user account' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Body() dto: LoginDto, @Res() res: Response) {
    const data = await this.authService.login(dto);
    res.status(200).json({
      statusCode: 200,
      message: 'Login successful',
      data,
    });
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('me')
  @ApiOperation({ summary: 'Get authenticated user profile' })
  @ApiResponse({ status: 200, description: 'Authenticated user profile' })
  async profile(
    @Req() req: Request & { user: { userId: number } },
    @Res() res: Response,
  ) {
    const data = await this.authService.profile(req.user.userId);
    res.status(200).json({
      statusCode: 200,
      message: 'Authenticated user profile',
      data,
    });
  }
}