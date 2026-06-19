import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { AvailabilityController } from './availability.controller';
import { AvailabilityRepository } from './repository/availability.repository';
import { AvailabilityService } from './service/availability.service';

@Module({
  imports: [PrismaModule],
  controllers: [AvailabilityController],
  providers: [AvailabilityService, AvailabilityRepository],
  exports: [AvailabilityService, AvailabilityRepository],
})
export class AvailabilityModule {}