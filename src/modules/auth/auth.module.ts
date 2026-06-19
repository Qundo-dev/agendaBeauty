import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { PrismaModule } from '../../prisma/prisma.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { AuthRepository } from './repository/auth.repository';
import { RolesGuard } from './guards/roles.guard';
import { SubscriptionActiveGuard } from './guards/subscription-active.guard';

@Module({
  imports: [
    PrismaModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'BEAUTY_FLOW_SECRET_KEY',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthRepository, JwtStrategy, RolesGuard, SubscriptionActiveGuard],
  exports: [AuthService, JwtModule, RolesGuard, SubscriptionActiveGuard],
})
export class AuthModule {}