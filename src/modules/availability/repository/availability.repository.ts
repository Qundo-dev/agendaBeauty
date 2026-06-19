import { Injectable } from '@nestjs/common';
import { Availability } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';
import { BulkAvailabilityDto } from './dto/bulk-availability.dto';
import { UpdateAvailabilityDto } from './dto/update.availability.dto';

@Injectable()
export class AvailabilityRepository {
  constructor(private readonly prisma: PrismaService) {}

  async bulkUpsertAvailability(
    dto: BulkAvailabilityDto,
  ): Promise<Availability[] | null> {
    const business = await this.prisma.business.findUnique({
      where: { id: dto.businessId },
    });

    if (!business) {
      return null;
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.availability.deleteMany({
        where: { businessId: dto.businessId },
      });

      if (dto.availabilities.length > 0) {
        await tx.availability.createMany({
          data: dto.availabilities.map((availability) => ({
            dayOfWeek: availability.dayOfWeek,
            startTime: availability.startTime,
            endTime: availability.endTime,
            businessId: dto.businessId,
          })),
        });
      }
    });

    return this.prisma.availability.findMany({
      where: { businessId: dto.businessId },
      orderBy: { dayOfWeek: 'asc' },
      include: { business: true },
    });
  }

  async getAvailabilityByBusinessId(
    businessId: number,
  ): Promise<Availability[] | null> {
    const business = await this.prisma.business.findUnique({
      where: { id: businessId },
    });

    if (!business) {
      return null;
    }

    return this.prisma.availability.findMany({
      where: { businessId },
      orderBy: { dayOfWeek: 'asc' },
      include: { business: true },
    });
  }

  async updateAvailability(
    id: number,
    dto: UpdateAvailabilityDto,
  ): Promise<Availability | null> {
    const existingAvailability = await this.prisma.availability.findUnique({
      where: { id },
    });

    if (!existingAvailability) {
      return null;
    }

    return this.prisma.availability.update({
      where: { id },
      data: dto,
      include: { business: true },
    });
  }
}