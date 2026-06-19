import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { ShiftsController } from './shifts.controller';
import { ShiftsRepository } from './repository/shifts.repository';
import { ShiftsService } from './service/shifts.service';

@Module({
  imports: [PrismaModule],
  controllers: [ShiftsController],
  providers: [ShiftsService, ShiftsRepository],
  exports: [ShiftsService, ShiftsRepository],
})
export class ShiftsModule {}