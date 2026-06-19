import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { SubscriptionsController } from './subscriptions.controller';
import { SubscriptionsRepository } from './repository/subscriptions.repository';
import { SubscriptionsService } from './service/subscriptions.service';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [SubscriptionsController],
  providers: [SubscriptionsService, SubscriptionsRepository],
  exports: [SubscriptionsService, SubscriptionsRepository],
})
export class SubscriptionsModule {}