import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { BusinessController } from './business.controller';
import { BusinessRepository } from './repository/business.repository';
import { BusinessService } from './service/business.service';

@Module({
  imports: [PrismaModule],
  controllers: [BusinessController],
  providers: [BusinessService, BusinessRepository],
  exports: [BusinessService, BusinessRepository],
})
export class BusinessModule {}