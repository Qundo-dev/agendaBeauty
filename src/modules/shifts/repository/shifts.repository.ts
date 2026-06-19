import { Injectable } from '@nestjs/common';
import { Prisma, Shift } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';
import { AvailableSlotsQueryDto } from './dto/available-slots-query.dto';
import { BusinessShiftsQueryDto } from './dto/business-shifts-query.dto';
import { CreateShiftDto } from './dto/create-shift.dto';
import { ShiftStatsQueryDto } from './dto/shift-stats-query.dto';
import { UpdateShiftStatusDto } from './dto/update-shift-status.dto';

type ShiftWithRelations = Prisma.ShiftGetPayload<{
  include: {
    business: true;
    service: true;
    employee: true;
  };
}>;

@Injectable()
export class ShiftsRepository {
  constructor(private readonly prisma: PrismaService) {}

  private buildDate(date: string, time: string): Date {
    return new Date(`${date}T${time}:00`);
  }

  private addMinutes(date: Date, minutes: number): Date {
    return new Date(date.getTime() + minutes * 60000);
  }

  private getDayRange(date: string) {
    const start = new Date(`${date}T00:00:00`);
    const end = new Date(`${date}T23:59:59`);
    return { start, end };
  }

  private getDayOfWeek(date: string): number {
    return new Date(`${date}T00:00:00`).getDay();
  }

  private formatHour(date: Date): string {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  private overlaps(
    startA: Date,
    endA: Date,
    startB: Date,
    endB: Date,
  ): boolean {
    return startA < endB && endA > startB;
  }

  async getAvailableSlots(dto: AvailableSlotsQueryDto): Promise<string[] | null> {
    const business = await this.prisma.business.findUnique({
      where: { id: dto.businessId },
    });

    if (!business) {
      return null;
    }

    const service = await this.prisma.service.findFirst({
      where: {
        id: dto.serviceId,
        businessId: dto.businessId,
        enable: true,
      },
    });

    if (!service) {
      throw new Error('El servicio no existe o no pertenece al negocio');
    }

    const dayOfWeek = this.getDayOfWeek(dto.date);
    const availability = await this.prisma.availability.findFirst({
      where: {
        businessId: dto.businessId,
        dayOfWeek,
      },
    });

    if (!availability) {
      return [];
    }

    const { start, end } = this.getDayRange(dto.date);
    const occupiedShifts = await this.prisma.shift.findMany({
      where: {
        businessId: dto.businessId,
        startTime: {
          gte: start,
          lte: end,
        },
        status: {
          not: 'cancelled',
        },
      },
      orderBy: {
        startTime: 'asc',
      },
    });

    const openStart = this.buildDate(dto.date, availability.startTime);
    const openEnd = this.buildDate(dto.date, availability.endTime);
    const slots: string[] = [];
    let cursor = new Date(openStart);
    const todayString = new Date().toISOString().slice(0, 10);

    while (this.addMinutes(cursor, service.time) <= openEnd) {
      const slotEnd = this.addMinutes(cursor, service.time);

      const isOccupied = occupiedShifts.some((shift) =>
        this.overlaps(cursor, slotEnd, shift.startTime, shift.endTime),
      );

      const isPast = dto.date === todayString && cursor.getTime() < Date.now();

      if (!isOccupied && !isPast) {
        slots.push(this.formatHour(cursor));
      }

      cursor = this.addMinutes(cursor, service.time);
    }

    return slots;
  }

  async createShift(dto: CreateShiftDto): Promise<ShiftWithRelations | null> {
    return this.prisma.$transaction(async (tx) => {
      const business = await tx.business.findUnique({
        where: { id: dto.businessId },
      });

      if (!business) {
        return null;
      }

      const service = await tx.service.findFirst({
        where: {
          id: dto.serviceId,
          businessId: dto.businessId,
          enable: true,
        },
      });

      if (!service) {
        throw new Error('El servicio no existe o no pertenece al negocio');
      }

      if (dto.employeeId) {
        const employee = await tx.employee.findFirst({
          where: {
            id: dto.employeeId,
            businessId: dto.businessId,
          },
        });

        if (!employee) {
          throw new Error('El empleado no existe o no pertenece al negocio');
        }
      }

      const dayOfWeek = this.getDayOfWeek(dto.date);
      const availability = await tx.availability.findFirst({
        where: {
          businessId: dto.businessId,
          dayOfWeek,
        },
      });

      if (!availability) {
        throw new Error(
          'El negocio no tiene disponibilidad configurada para ese dia',
        );
      }

      const startTime = this.buildDate(dto.date, dto.startTime);
      const endTime = this.addMinutes(startTime, service.time);
      const openStart = this.buildDate(dto.date, availability.startTime);
      const openEnd = this.buildDate(dto.date, availability.endTime);

      if (startTime < openStart || endTime > openEnd) {
        throw new Error('El horario elegido esta fuera del rango de apertura');
      }

      const overlappingShift = await tx.shift.findFirst({
        where: {
          businessId: dto.businessId,
          status: {
            not: 'cancelled',
          },
          AND: [{ startTime: { lt: endTime } }, { endTime: { gt: startTime } }],
        },
      });

      if (overlappingShift) {
        throw new Error('El horario seleccionado ya no esta disponible');
      }

      return tx.shift.create({
        data: {
          clientName: dto.clientName,
          clientEmail: dto.clientEmail,
          clientPhone: dto.clientPhone,
          status: 'pending',
          startTime,
          endTime,
          businessId: dto.businessId,
          serviceId: dto.serviceId,
          employeeId: dto.employeeId,
        },
        include: {
          business: true,
          service: true,
          employee: true,
        },
      });
    });
  }

  async getBusinessShifts(
    businessId: number,
    query: BusinessShiftsQueryDto,
  ): Promise<ShiftWithRelations[] | null> {
    const business = await this.prisma.business.findUnique({
      where: { id: businessId },
    });

    if (!business) {
      return null;
    }

    const { start, end } = this.getDayRange(query.date);

    return this.prisma.shift.findMany({
      where: {
        businessId,
        startTime: {
          gte: start,
          lte: end,
        },
      },
      orderBy: {
        startTime: 'asc',
      },
      include: {
        business: true,
        service: true,
        employee: true,
      },
    });
  }

  async updateShiftStatus(
    id: number,
    dto: UpdateShiftStatusDto,
  ): Promise<ShiftWithRelations | null> {
    const existingShift = await this.prisma.shift.findUnique({
      where: { id },
    });

    if (!existingShift) {
      return null;
    }

    return this.prisma.shift.update({
      where: { id },
      data: {
        status: dto.status,
      },
      include: {
        business: true,
        service: true,
        employee: true,
      },
    });
  }

  async getBusinessShiftStats(
    businessId: number,
    query: ShiftStatsQueryDto,
  ): Promise<{
    total: number;
    pending: number;
    confirmed: number;
    cancelled: number;
    completed: number;
  } | null> {
    const business = await this.prisma.business.findUnique({
      where: { id: businessId },
    });

    if (!business) {
      return null;
    }

    let year: number;
    let month: number;

    if (query.month) {
      const parts = query.month.split('-');
      year = Number(parts[0]);
      month = Number(parts[1]) - 1;
    } else {
      const now = new Date();
      year = now.getFullYear();
      month = now.getMonth();
    }

    const from = new Date(year, month, 1, 0, 0, 0);
    const to = new Date(year, month + 1, 1, 0, 0, 0);

    const shifts = await this.prisma.shift.findMany({
      where: {
        businessId,
        startTime: {
          gte: from,
          lt: to,
        },
      },
      select: {
        status: true,
      },
    });

    return {
      total: shifts.length,
      pending: shifts.filter((shift) => shift.status === 'pending').length,
      confirmed: shifts.filter((shift) => shift.status === 'confirmed').length,
      cancelled: shifts.filter((shift) => shift.status === 'cancelled').length,
      completed: shifts.filter((shift) => shift.status === 'completed').length,
    };
  }
}