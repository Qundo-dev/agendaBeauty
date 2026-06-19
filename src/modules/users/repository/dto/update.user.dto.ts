import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({ required: false, example: 'Facundo Perez' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ required: false, example: 'facundo@mail.com' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ required: false, example: 'NuevaClave123' })
  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;
}