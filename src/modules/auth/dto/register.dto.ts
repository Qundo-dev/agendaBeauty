import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'Facundo Perez' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 'facundo@mail.com' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Secreta123' })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;
}