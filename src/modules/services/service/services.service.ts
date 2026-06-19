import { Injectable } from '@nestjs/common';
import { PaginationRequestListDto } from '../../../helpers/pagination-request-list.dto';
import { ResponseTemplate } from '../../dto/response-template.dto';
import { CreateServiceDto } from '../repository/dto/create.service.dto';
import { UpdateServiceDto } from '../repository/dto/update.service.dto';
import { ServicesRepository } from '../repository/services.repository';

@Injectable()
export class ServicesService {
  constructor(private readonly servicesRepository: ServicesRepository) {}

  async listServices(
    options: PaginationRequestListDto,
  ): Promise<ResponseTemplate> {
    try {
      const services = await this.servicesRepository.listServices(options);
      return new ResponseTemplate(200, 'List services success', services);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Error al obtener los servicios del sistema';

      return new ResponseTemplate(500, 'Internal Server Error', {
        mensajeError: message,
      });
    }
  }

  async getServiceById(id: number): Promise<ResponseTemplate> {
    try {
      const service = await this.servicesRepository.getServiceById(id);

      if (!service) {
        return new ResponseTemplate(404, 'Service not found', null);
      }

      return new ResponseTemplate(200, 'Get service by ID success', service);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Error al obtener el servicio por ID';

      return new ResponseTemplate(500, 'Internal Server Error', {
        mensajeError: message,
      });
    }
  }

  async createService(data: CreateServiceDto): Promise<ResponseTemplate> {
    try {
      const service = await this.servicesRepository.createService(data);
      return new ResponseTemplate(201, 'Service created successfully', service);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Error al crear el servicio';

      return new ResponseTemplate(500, 'Internal Server Error', {
        mensajeError: message,
      });
    }
  }

  async updateService(
    id: number,
    data: UpdateServiceDto,
  ): Promise<ResponseTemplate> {
    try {
      const service = await this.servicesRepository.updateService(id, data);

      if (!service) {
        return new ResponseTemplate(404, 'Service not found', null);
      }

      return new ResponseTemplate(200, 'Service updated successfully', service);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Error al actualizar el servicio';

      return new ResponseTemplate(500, 'Internal Server Error', {
        mensajeError: message,
      });
    }
  }

  async deleteService(id: number): Promise<ResponseTemplate> {
    try {
      const service = await this.servicesRepository.deleteService(id);

      if (!service) {
        return new ResponseTemplate(404, 'Service not found', null);
      }

      return new ResponseTemplate(200, 'Service deleted successfully', service);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Error al eliminar el servicio';

      return new ResponseTemplate(500, 'Internal Server Error', {
        mensajeError: message,
      });
    }
  }
}