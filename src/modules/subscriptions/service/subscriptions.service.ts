import { ForbiddenException, Injectable } from '@nestjs/common';
import { ResponseTemplate } from '../../dto/response-template.dto';
import { CreateSubscriptionDto } from '../repository/dto/create.subscription.dto';
import { SubscriptionsRepository } from '../repository/subscriptions.repository';

@Injectable()
export class SubscriptionsService {
  constructor(
    private readonly subscriptionsRepository: SubscriptionsRepository,
  ) {}

  async createSubscription(
    dto: CreateSubscriptionDto,
    authenticatedBusinessId?: number,
  ): Promise<ResponseTemplate> {
    try {
      if (
        authenticatedBusinessId !== undefined
        && dto.businessId !== authenticatedBusinessId
      ) {
        throw new ForbiddenException(
          'No puedes crear una suscripcion para otro negocio',
        );
      }

      const subscription = await this.subscriptionsRepository.createSubscription(
        dto,
      );

      if (!subscription) {
        return new ResponseTemplate(404, 'Business not found', null);
      }

      return new ResponseTemplate(
        201,
        'Subscription created successfully',
        subscription,
      );
    } catch (error) {
      if (error instanceof ForbiddenException) {
        return new ResponseTemplate(403, error.message, null);
      }

      const message =
        error instanceof Error ? error.message : 'Error al crear la suscripcion';

      return new ResponseTemplate(500, 'Internal Server Error', {
        mensajeError: message,
      });
    }
  }

  async getActiveSubscriptionByBusinessId(
    businessId: number,
    authenticatedBusinessId?: number,
  ): Promise<ResponseTemplate> {
    try {
      if (
        authenticatedBusinessId !== undefined
        && businessId !== authenticatedBusinessId
      ) {
        throw new ForbiddenException(
          'No puedes consultar la suscripcion de otro negocio',
        );
      }

      const status =
        await this.subscriptionsRepository.getActiveSubscriptionByBusinessId(
          businessId,
        );

      if (!status) {
        return new ResponseTemplate(404, 'Business not found', null);
      }

      return new ResponseTemplate(
        200,
        'Get active subscription success',
        status,
      );
    } catch (error) {
      if (error instanceof ForbiddenException) {
        return new ResponseTemplate(403, error.message, null);
      }

      const message =
        error instanceof Error
          ? error.message
          : 'Error al verificar la suscripcion activa';

      return new ResponseTemplate(500, 'Internal Server Error', {
        mensajeError: message,
      });
    }
  }
}