import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDateString, IsIn, IsInt, IsOptional, Min } from 'class-validator';

export class CreateSubscriptionDto {
  @ApiProperty({ example: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  businessId: number;

  @ApiProperty({ example: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  planId: number;

  @ApiProperty({ required: false, example: 'active', enum: ['active', 'expired'] })
  @IsOptional()
  @IsIn(['active', 'expired'])
  status?: string;

  @ApiProperty({ required: false, example: '2026-06-19T00:00:00.000Z' })
  @IsOptional()
  @IsDateString()
  startAt?: string;

  @ApiProperty({ example: '2026-07-19T00:00:00.000Z' })
  @IsDateString()
  endAt: string;
}