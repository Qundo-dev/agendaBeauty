import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { ServicesController } from './services.controller';
import { ServicesRepository } from './repository/services.repository';
import { ServicesService } from './service/services.service';

@Module({
  imports: [PrismaModule],
  controllers: [ServicesController],
  providers: [ServicesService, ServicesRepository],
  exports: [ServicesService, ServicesRepository],
})
export class ServicesModule {}