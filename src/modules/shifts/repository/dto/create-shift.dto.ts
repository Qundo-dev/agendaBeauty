import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDateString,
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  Min,
} from 'class-validator';

export class CreateShiftDto {
  @ApiProperty({ example: 'Juan Perez' })
  @IsNotEmpty()
  @IsString()
  clientName: string;

  @ApiProperty({ example: 'juan@email.com' })
  @IsNotEmpty()
  @IsEmail()
  clientEmail: string;

  @ApiProperty({ example: '+5491122334455' })
  @IsNotEmpty()
  @IsString()
  clientPhone: string;

  @ApiProperty({ example: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  businessId: number;

  @ApiProperty({ example: 2 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  serviceId: number;

  @ApiProperty({ required: false, example: 3 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  employeeId?: number;

  @ApiProperty({ example: '2024-10-20' })
  @IsDateString()
  date: string;

  @ApiProperty({ example: '10:30' })
  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
  startTime: string;
}