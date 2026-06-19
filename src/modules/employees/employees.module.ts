import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { EmployeesController } from './employees.controller';
import { EmployeesRepository } from './repository/employees.repository';
import { EmployeesService } from './service/employees.service';

@Module({
  imports: [PrismaModule],
  controllers: [EmployeesController],
  providers: [EmployeesService, EmployeesRepository],
  exports: [EmployeesService, EmployeesRepository],
})
export class EmployeesModule {}