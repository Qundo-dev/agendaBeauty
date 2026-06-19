import { ConflictException, Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../../prisma/prisma.service';
import { RegisterDto } from '../dto/register.dto';

type UserWithBusiness = Prisma.UserGetPayload<{
  include: {
    business: true;
  };
}>;

@Injectable()
export class AuthRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findUserByEmail(email: string): Promise<UserWithBusiness | null> {
    return this.prisma.user.findUnique({
      where: { email },
      include: {
        business: true,
      },
    });
  }

  async findUserById(id: number): Promise<UserWithBusiness | null> {
    return this.prisma.user.findUnique({
      where: { id },
      include: {
        business: true,
      },
    });
  }

  async createClienteUser(
    dto: RegisterDto,
  ): Promise<User> {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new ConflictException('El correo electronico ya esta en uso');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(dto.password, salt);

    return this.prisma.user.create({
      data: {
        name: dto.name,
        email: dto.email,
        password: hashedPassword,
        role: 'cliente',
      },
    });
  }
}