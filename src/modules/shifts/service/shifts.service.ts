import { Injectable } from '@nestjs/common';
import { ResponseTemplate } from '../../dto/response-template.dto';
import { ShiftsRepository } from '../repository/shifts.repository';
import { AvailableSlotsQueryDto } from '../repository/dto/available-slots-query.dto';
import { BusinessShiftsQueryDto } from '../repository/dto/business-shifts-query.dto';
import { CreateShiftDto } from '../repository/dto/create-shift.dto';
import { ShiftStatsQueryDto } from '../repository/dto/shift-stats-query.dto';
import { UpdateShiftStatusDto } from '../repository/dto/update-shift-status.dto';

@Injectable()
export class ShiftsService {
  constructor(private readonly shiftsRepository: ShiftsRepository) {}

  async getAvailableSlots(
    dto: AvailableSlotsQueryDto,
  ): Promise<ResponseTemplate> {
    try {
      const slots = await this.shiftsRepository.getAvailableSlots(dto);

      if (slots === null) {
        return new ResponseTemplate(404, 'Business not found', null);
      }

      return new ResponseTemplate(200, 'Available slots success', slots);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Error al obtener los horarios disponibles';

      return new ResponseTemplate(500, 'Internal Server Error', {
        mensajeError: message,
      });
    }
  }

  async createShift(dto: CreateShiftDto): Promise<ResponseTemplate> {
    try {
      const shift = await this.shiftsRepository.createShift(dto);

      if (!shift) {
        return new ResponseTemplate(404, 'Business not found', null);
      }

      return new ResponseTemplate(201, 'Shift created successfully', shift);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Error al crear el turno';

      return new ResponseTemplate(500, 'Internal Server Error', {
        mensajeError: message,
      });
    }
  }

  async getBusinessShifts(
    businessId: number,
    query: BusinessShiftsQueryDto,
  ): Promise<ResponseTemplate> {
    try {
      const shifts = await this.shiftsRepository.getBusinessShifts(
        businessId,
        query,
      );

      if (!shifts) {
        return new ResponseTemplate(404, 'Business not found', null);
      }

      return new ResponseTemplate(200, 'Get business shifts success', shifts);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Error al obtener los turnos del negocio';

      return new ResponseTemplate(500, 'Internal Server Error', {
        mensajeError: message,
      });
    }
  }

  async updateShiftStatus(
    id: number,
    dto: UpdateShiftStatusDto,
  ): Promise<ResponseTemplate> {
    try {
      const shift = await this.shiftsRepository.updateShiftStatus(id, dto);

      if (!shift) {
        return new ResponseTemplate(404, 'Shift not found', null);
      }

      return new ResponseTemplate(
        200,
        'Shift status updated successfully',
        shift,
      );
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Error al actualizar el estado del turno';

      return new ResponseTemplate(500, 'Internal Server Error', {
        mensajeError: message,
      });
    }
  }

  async getBusinessShiftStats(
    businessId: number,
    query: ShiftStatsQueryDto,
  ): Promise<ResponseTemplate> {
    try {
      const stats = await this.shiftsRepository.getBusinessShiftStats(
        businessId,
        query,
      );

      if (!stats) {
        return new ResponseTemplate(404, 'Business not found', null);
      }

      return new ResponseTemplate(
        200,
        'Get business shift stats success',
        stats,
      );
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Error al obtener estadisticas de turnos';

      return new ResponseTemplate(500, 'Internal Server Error', {
        mensajeError: message,
      });
    }
  }
}