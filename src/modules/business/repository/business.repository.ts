import { Injectable } from '@nestjs/common';
import { Business } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';
import {
  PaginationRequestListDto,
  PaginationResult,
} from '../../../helpers/pagination-request-list.dto';
import { CreateBusinessDto } from './dto/create.business.dto';
import { UpdateBusinessDto } from './dto/update.business.dto';

@Injectable()
export class BusinessRepository {
  constructor(private readonly prisma: PrismaService) {}

  async listBusiness(
    options?: PaginationRequestListDto,
  ): Promise<PaginationResult<Business[]>> {
    const { sortBy, search } = options || {};
    const items = Number(options?.items) || 1;
    const totalBusinesses = await this.prisma.business.count();
    const itemsPerPage = Number(options?.itemsPerPage) || totalBusinesses || 10;

    const where = search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' as const } },
            { email: { contains: search, mode: 'insensitive' as const } },
            { slug: { contains: search, mode: 'insensitive' as const } },
            { phone: { contains: search, mode: 'insensitive' as const } },
          ],
        }
      : {};

    const totalData = await this.prisma.business.count({ where });
    const data = await this.prisma.business.findMany({
      where,
      skip: (items - 1) * itemsPerPage,
      take: itemsPerPage,
      orderBy: {
        id: sortBy === 'desc' ? 'desc' : 'asc',
      },
    });

    return {
      totalData,
      items,
      itemsPerPage,
      data,
    };
  }

  async getBusinessById(id: number): Promise<Business | null> {
    return this.prisma.business.findUnique({
      where: { id },
      include: {
        employees: true,
        services: true,
        availabilities: true,
        shifts: true,
        subscriptions: true,
      },
    });
  }

  async createBusiness(data: CreateBusinessDto): Promise<Business> {
    return this.prisma.business.create({
      data,
    });
  }

  async updateBusiness(
    id: number,
    data: UpdateBusinessDto,
  ): Promise<Business | null> {
    const existingBusiness = await this.prisma.business.findUnique({
      where: { id },
    });

    if (!existingBusiness) {
      return null;
    }

    return this.prisma.business.update({
      where: { id },
      data,
    });
  }

  async deleteBusiness(id: number): Promise<Business | null> {
    const existingBusiness = await this.prisma.business.findUnique({
      where: { id },
    });

    if (!existingBusiness) {
      return null;
    }

    return this.prisma.business.delete({
      where: { id },
    });
  }
}