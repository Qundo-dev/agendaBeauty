import { Injectable } from '@nestjs/common';
import { ResponseTemplate } from '../../dto/response-template.dto';
import { AvailabilityRepository } from '../repository/availability.repository';
import { BulkAvailabilityDto } from '../repository/dto/bulk-availability.dto';
import { UpdateAvailabilityDto } from '../repository/dto/update.availability.dto';

@Injectable()
export class AvailabilityService {
  constructor(private readonly availabilityRepository: AvailabilityRepository) {}

  async bulkUpsertAvailability(
    dto: BulkAvailabilityDto,
  ): Promise<ResponseTemplate> {
    try {
      const availabilities =
        await this.availabilityRepository.bulkUpsertAvailability(dto);

      if (!availabilities) {
        return new ResponseTemplate(404, 'Business not found', null);
      }

      return new ResponseTemplate(
        201,
        'Availability configured successfully',
        availabilities,
      );
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Error al configurar la disponibilidad del negocio';

      return new ResponseTemplate(500, 'Internal Server Error', {
        mensajeError: message,
      });
    }
  }

  async getAvailabilityByBusinessId(
    businessId: number,
  ): Promise<ResponseTemplate> {
    try {
      const availabilities =
        await this.availabilityRepository.getAvailabilityByBusinessId(
          businessId,
        );

      if (!availabilities) {
        return new ResponseTemplate(404, 'Business not found', null);
      }

      return new ResponseTemplate(
        200,
        'Get availability by business success',
        availabilities,
      );
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Error al obtener la disponibilidad del negocio';

      return new ResponseTemplate(500, 'Internal Server Error', {
        mensajeError: message,
      });
    }
  }

  async updateAvailability(
    id: number,
    dto: UpdateAvailabilityDto,
  ): Promise<ResponseTemplate> {
    try {
      const availability = await this.availabilityRepository.updateAvailability(
        id,
        dto,
      );

      if (!availability) {
        return new ResponseTemplate(404, 'Availability not found', null);
      }

      return new ResponseTemplate(
        200,
        'Availability updated successfully',
        availability,
      );
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Error al actualizar la disponibilidad';

      return new ResponseTemplate(500, 'Internal Server Error', {
        mensajeError: message,
      });
    }
  }
}