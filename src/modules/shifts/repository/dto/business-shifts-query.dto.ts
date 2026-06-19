import { ApiProperty } from '@nestjs/swagger';
import { IsDateString } from 'class-validator';

export class BusinessShiftsQueryDto {
  @ApiProperty({ example: '2024-10-20' })
  @IsDateString()
  date: string;
}