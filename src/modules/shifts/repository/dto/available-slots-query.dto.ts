import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDateString, IsInt, Min } from 'class-validator';

export class AvailableSlotsQueryDto {
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

  @ApiProperty({ example: '2024-10-20' })
  @IsDateString()
  date: string;
}