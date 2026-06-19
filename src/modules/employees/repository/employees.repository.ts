import { Injectable } from '@nestjs/common';
import { Employee, Prisma } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';
import {
  PaginationRequestListDto,
  PaginationResult,
} from '../../../helpers/pagination-request-list.dto';
import { CreateEmployeeDto } from './dto/create.employee.dto';
import { UpdateEmployeeDto } from './dto/update.employee.dto';

@Injectable()
export class EmployeesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async listEmployees(
    options?: PaginationRequestListDto,
  ): Promise<PaginationResult<Employee[]>> {
    const { sortBy, search } = options || {};
    const items = Number(options?.items) || 1;
    const totalEmployees = await this.prisma.employee.count();
    const itemsPerPage = Number(options?.itemsPerPage) || totalEmployees || 10;

    const where: Prisma.EmployeeWhereInput = search
      ? {
          OR: [{ name: { contains: search, mode: 'insensitive' } }],
        }
      : {};

    const totalData = await this.prisma.employee.count({ where });
    const data = await this.prisma.employee.findMany({
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

  async getEmployeeById(id: number): Promise<Employee | null> {
    return this.prisma.employee.findUnique({
      where: { id },
      include: {
        business: true,
        shifts: true,
      },
    });
  }

  async createEmployee(data: CreateEmployeeDto): Promise<Employee> {
    return this.prisma.employee.create({
      data,
    });
  }

  async updateEmployee(
    id: number,
    data: UpdateEmployeeDto,
  ): Promise<Employee | null> {
    const existingEmployee = await this.prisma.employee.findUnique({
      where: { id },
    });

    if (!existingEmployee) {
      return null;
    }

    return this.prisma.employee.update({
      where: { id },
      data,
    });
  }

  async deleteEmployee(id: number): Promise<Employee | null> {
    const existingEmployee = await this.prisma.employee.findUnique({
      where: { id },
    });

    if (!existingEmployee) {
      return null;
    }

    return this.prisma.employee.delete({
      where: { id },
    });
  }
}