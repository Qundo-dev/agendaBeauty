import { Injectable } from '@nestjs/common';
import { BusinessRepository } from '../repository/business.repository';
import { CreateBusinessDto } from '../repository/dto/create.business.dto';
import { UpdateBusinessDto } from '../repository/dto/update.business.dto';
import { PaginationRequestListDto } from '../../../helpers/pagination-request-list.dto';
import { ResponseTemplate } from '../../dto/response-template.dto';

@Injectable()
export class BusinessService {
  constructor(private readonly businessRepository: BusinessRepository) {}

  async listBusiness(
    options: PaginationRequestListDto,
  ): Promise<ResponseTemplate> {
    try {
      const businesses = await this.businessRepository.listBusiness(options);
      return new ResponseTemplate(200, 'List business success', businesses);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Error al obtener los negocios del sistema';

      return new ResponseTemplate(500, 'Internal Server Error', {
        mensajeError: message,
      });
    }
  }

  async getBusinessById(id: number): Promise<ResponseTemplate> {
    try {
      const business = await this.businessRepository.getBusinessById(id);

      if (!business) {
        return new ResponseTemplate(404, 'Business not found', null);
      }

      return new ResponseTemplate(200, 'Get business by ID success', business);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Error al obtener el negocio por ID';

      return new ResponseTemplate(500, 'Internal Server Error', {
        mensajeError: message,
      });
    }
  }

  async createBusiness(data: CreateBusinessDto): Promise<ResponseTemplate> {
    try {
      const business = await this.businessRepository.createBusiness(data);
      return new ResponseTemplate(201, 'Business created successfully', business);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Error al crear el negocio';

      return new ResponseTemplate(500, 'Internal Server Error', {
        mensajeError: message,
      });
    }
  }

  async updateBusiness(
    id: number,
    data: UpdateBusinessDto,
  ): Promise<ResponseTemplate> {
    try {
      const business = await this.businessRepository.updateBusiness(id, data);

      if (!business) {
        return new ResponseTemplate(404, 'Business not found', null);
      }

      return new ResponseTemplate(200, 'Business updated successfully', business);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Error al actualizar el negocio';

      return new ResponseTemplate(500, 'Internal Server Error', {
        mensajeError: message,
      });
    }
  }

  async deleteBusiness(id: number): Promise<ResponseTemplate> {
    try {
      const business = await this.businessRepository.deleteBusiness(id);

      if (!business) {
        return new ResponseTemplate(404, 'Business not found', null);
      }

      return new ResponseTemplate(200, 'Business deleted successfully', business);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Error al eliminar el negocio';

      return new ResponseTemplate(500, 'Internal Server Error', {
        mensajeError: message,
      });
    }
  }
}