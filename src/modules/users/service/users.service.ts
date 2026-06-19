import { ConflictException, Injectable } from '@nestjs/common';
import { PaginationRequestListDto } from '../../../helpers/pagination-request-list.dto';
import { ResponseTemplate } from '../../dto/response-template.dto';
import { CreateUserDto } from '../repository/dto/create.user.dto';
import { UpdateUserDto } from '../repository/dto/update.user.dto';
import { UsersRepository } from '../repository/users.repository';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async listUsers(options: PaginationRequestListDto): Promise<ResponseTemplate> {
    try {
      const users = await this.usersRepository.listUsers(options);
      return new ResponseTemplate(200, 'List users success', users);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Error al obtener los usuarios del sistema';

      return new ResponseTemplate(500, 'Internal Server Error', {
        mensajeError: message,
      });
    }
  }

  async getUserById(id: number): Promise<ResponseTemplate> {
    try {
      const user = await this.usersRepository.getUserById(id);

      if (!user) {
        return new ResponseTemplate(404, 'User not found', null);
      }

      return new ResponseTemplate(200, 'Get user by ID success', user);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Error al obtener el usuario';

      return new ResponseTemplate(500, 'Internal Server Error', {
        mensajeError: message,
      });
    }
  }

  async createUser(dto: CreateUserDto): Promise<ResponseTemplate> {
    try {
      const user = await this.usersRepository.createClienteUser(dto);

      return new ResponseTemplate(201, 'User created as cliente successfully', user);
    } catch (error) {
      if (error instanceof ConflictException) {
        return new ResponseTemplate(409, error.message, null);
      }

      const message =
        error instanceof Error ? error.message : 'Error al crear el usuario';

      return new ResponseTemplate(500, 'Internal Server Error', {
        mensajeError: message,
      });
    }
  }

  async updateUser(id: number, dto: UpdateUserDto): Promise<ResponseTemplate> {
    try {
      const user = await this.usersRepository.updateUser(id, dto);

      if (!user) {
        return new ResponseTemplate(404, 'User not found', null);
      }

      return new ResponseTemplate(200, 'User updated successfully', user);
    } catch (error) {
      if (error instanceof ConflictException) {
        return new ResponseTemplate(409, error.message, null);
      }

      const message =
        error instanceof Error ? error.message : 'Error al actualizar el usuario';

      return new ResponseTemplate(500, 'Internal Server Error', {
        mensajeError: message,
      });
    }
  }

  async deleteUser(id: number): Promise<ResponseTemplate> {
    try {
      const user = await this.usersRepository.deleteUser(id);

      if (!user) {
        return new ResponseTemplate(404, 'User not found', null);
      }

      return new ResponseTemplate(200, 'User deleted successfully', user);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Error al eliminar el usuario';

      return new ResponseTemplate(500, 'Internal Server Error', {
        mensajeError: message,
      });
    }
  }
}