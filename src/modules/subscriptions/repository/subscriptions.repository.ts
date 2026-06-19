import { Injectable } from '@nestjs/common';
import { Prisma, Subscription } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateSubscriptionDto } from './dto/create.subscription.dto';

type SubscriptionWithRelations = Prisma.SubscriptionGetPayload<{
  include: {
    business: true;
    plan: true;
  };
}>;

@Injectable()
export class SubscriptionsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createSubscription(
    dto: CreateSubscriptionDto,
  ): Promise<SubscriptionWithRelations | null> {
    return this.prisma.$transaction(async (tx) => {
      const business = await tx.business.findUnique({
        where: { id: dto.businessId },
      });

      if (!business) {
        return null;
      }

      const plan = await tx.plan.findUnique({
        where: { id: dto.planId },
      });

      if (!plan) {
        throw new Error('El plan seleccionado no existe');
      }

      await tx.subscription.updateMany({
        where: {
          businessId: dto.businessId,
          status: 'active',
        },
        data: {
          status: 'expired',
        },
      });

      return tx.subscription.create({
        data: {
          businessId: dto.businessId,
          planId: dto.planId,
          status: dto.status ?? 'active',
          startAt: dto.startAt ? new Date(dto.startAt) : new Date(),
          endAt: new Date(dto.endAt),
        },
        include: {
          business: true,
          plan: true,
        },
      });
    });
  }

  async getActiveSubscriptionByBusinessId(
    businessId: number,
  ): Promise<{
    hasActiveSubscription: boolean;
    subscription: SubscriptionWithRelations | null;
  } | null> {
    const business = await this.prisma.business.findUnique({
      where: { id: businessId },
    });

    if (!business) {
      return null;
    }

    const subscription = await this.prisma.subscription.findFirst({
      where: {
        businessId,
        status: 'active',
        endAt: {
          gte: new Date(),
        },
      },
      orderBy: {
        endAt: 'desc',
      },
      include: {
        business: true,
        plan: true,
      },
    });

    return {
      hasActiveSubscription: Boolean(subscription),
      subscription,
    };
  }
}