import { ConflictException, Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import {
  PaginationRequestListDto,
  PaginationResult,
} from '../../../helpers/pagination-request-list.dto';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateUserDto } from './dto/create.user.dto';
import { UpdateUserDto } from './dto/update.user.dto';

type UserWithBusiness = Prisma.UserGetPayload<{
  include: {
    business: true;
  };
}>;

@Injectable()
export class UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  private sanitizeUser<T extends { password?: string }>(user: T): Omit<T, 'password'> {
    const { password: _password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async listUsers(
    options?: PaginationRequestListDto,
  ): Promise<PaginationResult<Array<Omit<UserWithBusiness, 'password'>>>> {
    const { sortBy, search } = options || {};
    const items = Number(options?.items) || 1;
    const totalUsers = await this.prisma.user.count();
    const itemsPerPage = Number(options?.itemsPerPage) || totalUsers || 10;

    const where: Prisma.UserWhereInput = search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { email: { contains: search, mode: 'insensitive' } },
            { role: { contains: search, mode: 'insensitive' } },
          ],
        }
      : {};

    const totalData = await this.prisma.user.count({ where });
    const data = await this.prisma.user.findMany({
      where,
      skip: (items - 1) * itemsPerPage,
      take: itemsPerPage,
      orderBy: {
        id: sortBy === 'desc' ? 'desc' : 'asc',
      },
      include: {
        business: true,
      },
    });

    return {
      totalData,
      items,
      itemsPerPage,
      data: data.map((user) => this.sanitizeUser(user)),
    };
  }

  async getUserById(id: number): Promise<Omit<UserWithBusiness, 'password'> | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        business: true,
      },
    });

    if (!user) {
      return null;
    }

    return this.sanitizeUser(user);
  }

  async createClienteUser(
    dto: CreateUserDto,
  ): Promise<Omit<UserWithBusiness, 'password'>> {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new ConflictException('El correo electronico ya esta en uso');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(dto.password, salt);

    const user = await this.prisma.user.create({
      data: {
        name: dto.name,
        email: dto.email,
        password: hashedPassword,
        role: 'cliente',
      },
      include: {
        business: true,
      },
    });

    return this.sanitizeUser(user);
  }

  async updateUser(
    id: number,
    dto: UpdateUserDto,
  ): Promise<Omit<UserWithBusiness, 'password'> | null> {
    const existingUser = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      return null;
    }

    if (dto.email && dto.email !== existingUser.email) {
      const existingByEmail = await this.prisma.user.findUnique({
        where: { email: dto.email },
      });

      if (existingByEmail) {
        throw new ConflictException('El correo electronico ya esta en uso');
      }
    }

    const data: Prisma.UserUpdateInput = {
      name: dto.name,
      email: dto.email,
    };

    if (dto.password) {
      const salt = await bcrypt.genSalt(10);
      data.password = await bcrypt.hash(dto.password, salt);
    }

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data,
      include: {
        business: true,
      },
    });

    return this.sanitizeUser(updatedUser);
  }

  async deleteUser(id: number): Promise<Omit<User, 'password'> | null> {
    const existingUser = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      return null;
    }

    const deletedUser = await this.prisma.user.delete({
      where: { id },
    });

    return this.sanitizeUser(deletedUser);
  }
}