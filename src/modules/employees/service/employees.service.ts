import { Injectable } from '@nestjs/common';
import { PaginationRequestListDto } from '../../../helpers/pagination-request-list.dto';
import { ResponseTemplate } from '../../dto/response-template.dto';
import { CreateEmployeeDto } from '../repository/dto/create.employee.dto';
import { UpdateEmployeeDto } from '../repository/dto/update.employee.dto';
import { EmployeesRepository } from '../repository/employees.repository';

@Injectable()
export class EmployeesService {
  constructor(private readonly employeesRepository: EmployeesRepository) {}

  async listEmployees(
    options: PaginationRequestListDto,
  ): Promise<ResponseTemplate> {
    try {
      const employees = await this.employeesRepository.listEmployees(options);
      return new ResponseTemplate(200, 'List employees success', employees);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Error al obtener los empleados del sistema';

      return new ResponseTemplate(500, 'Internal Server Error', {
        mensajeError: message,
      });
    }
  }

  async getEmployeeById(id: number): Promise<ResponseTemplate> {
    try {
      const employee = await this.employeesRepository.getEmployeeById(id);

      if (!employee) {
        return new ResponseTemplate(404, 'Employee not found', null);
      }

      return new ResponseTemplate(200, 'Get employee by ID success', employee);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Error al obtener el empleado por ID';

      return new ResponseTemplate(500, 'Internal Server Error', {
        mensajeError: message,
      });
    }
  }

  async createEmployee(data: CreateEmployeeDto): Promise<ResponseTemplate> {
    try {
      const employee = await this.employeesRepository.createEmployee(data);
      return new ResponseTemplate(201, 'Employee created successfully', employee);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Error al crear el empleado';

      return new ResponseTemplate(500, 'Internal Server Error', {
        mensajeError: message,
      });
    }
  }

  async updateEmployee(
    id: number,
    data: UpdateEmployeeDto,
  ): Promise<ResponseTemplate> {
    try {
      const employee = await this.employeesRepository.updateEmployee(id, data);

      if (!employee) {
        return new ResponseTemplate(404, 'Employee not found', null);
      }

      return new ResponseTemplate(200, 'Employee updated successfully', employee);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Error al actualizar el empleado';

      return new ResponseTemplate(500, 'Internal Server Error', {
        mensajeError: message,
      });
    }
  }

  async deleteEmployee(id: number): Promise<ResponseTemplate> {
    try {
      const employee = await this.employeesRepository.deleteEmployee(id);

      if (!employee) {
        return new ResponseTemplate(404, 'Employee not found', null);
      }

      return new ResponseTemplate(200, 'Employee deleted successfully', employee);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Error al eliminar el empleado';

      return new ResponseTemplate(500, 'Internal Server Error', {
        mensajeError: message,
      });
    }
  }
}