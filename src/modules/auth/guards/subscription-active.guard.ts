import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class SubscriptionActiveGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const businessId = request.user?.businessId as number | null | undefined;

    if (!businessId) {
      throw new ForbiddenException('No se pudo identificar el negocio autenticado');
    }

    const activeSubscription = await this.prisma.subscription.findFirst({
      where: {
        businessId,
        status: 'active',
        endAt: {
          gte: new Date(),
        },
      },
    });

    if (!activeSubscription) {
      throw new ForbiddenException('Tu negocio no tiene una suscripcion activa');
    }

    return true;
  }
}