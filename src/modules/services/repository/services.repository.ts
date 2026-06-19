import { Injectable } from '@nestjs/common';
import { Prisma, Service } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';
import {
  PaginationRequestListDto,
  PaginationResult,
} from '../../../helpers/pagination-request-list.dto';
import { CreateServiceDto } from './dto/create.service.dto';
import { UpdateServiceDto } from './dto/update.service.dto';

@Injectable()
export class ServicesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async listServices(
    options?: PaginationRequestListDto,
  ): Promise<PaginationResult<Service[]>> {
    const { sortBy, search } = options || {};
    const items = Number(options?.items) || 1;
    const totalServices = await this.prisma.service.count();
    const itemsPerPage = Number(options?.itemsPerPage) || totalServices || 10;

    const where: Prisma.ServiceWhereInput = search
      ? {
          OR: [{ name: { contains: search, mode: 'insensitive' } }],
        }
      : {};

    const totalData = await this.prisma.service.count({ where });
    const data = await this.prisma.service.findMany({
      where,
      skip: (items - 1) * itemsPerPage,
      take: itemsPerPage,
      orderBy: {
        id: sortBy === 'desc' ? 'desc' : 'asc',
      },
      include: {
        business: true,
        shifts: true,
      },
    });

    return {
      totalData,
      items,
      itemsPerPage,
      data,
    };
  }

  async getServiceById(id: number): Promise<Service | null> {
    return this.prisma.service.findUnique({
      where: { id },
      include: {
        business: true,
        shifts: true,
      },
    });
  }

  async createService(data: CreateServiceDto): Promise<Service> {
    return this.prisma.service.create({
      data: {
        name: data.name,
        time: data.time,
        price: data.price,
        enable: data.enable ?? true,
        businessId: data.businessId,
      },
    });
  }

  async updateService(
    id: number,
    data: UpdateServiceDto,
  ): Promise<Service | null> {
    const existingService = await this.prisma.service.findUnique({
      where: { id },
    });

    if (!existingService) {
      return null;
    }

    return this.prisma.service.update({
      where: { id },
      data: {
        name: data.name,
        time: data.time,
        price: data.price,
        enable: data.enable,
        businessId: data.businessId,
      },
    });
  }

  async deleteService(id: number): Promise<Service | null> {
    const existingService = await this.prisma.service.findUnique({
      where: { id },
    });

    if (!existingService) {
      return null;
    }

    return this.prisma.service.delete({
      where: { id },
    });
  }
}