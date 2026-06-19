import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AvailabilityModule } from './modules/availability/availability.module';
import { AuthModule } from './modules/auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { BusinessModule } from './modules/business/business.module';
import { EmployeesModule } from './modules/employees/employees.module';
import { ShiftsModule } from './modules/shifts/shifts.module';
import { SubscriptionsModule } from './modules/subscriptions/subscriptions.module';
import { ServicesModule } from './modules/services/services.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    BusinessModule,
    EmployeesModule,
    ServicesModule,
    AvailabilityModule,
    ShiftsModule,
    SubscriptionsModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
