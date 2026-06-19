import { IsNumberString, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PaginationRequestListDto {
  @ApiProperty({ required: false, example: 1 })
  @IsOptional()
  @IsNumberString()
  items?: number;

  @ApiProperty({ required: false, example: 10 })
  @IsOptional()
  @IsNumberString()
  itemsPerPage?: number;

  @ApiProperty({ required: false, example: 'asc' })
  @IsOptional()
  @IsString()
  sortBy?: string;

  @ApiProperty({ required: false, example: 'beauty' })
  @IsOptional()
  @IsString()
  search?: string;
}

export interface PaginationResult<T> {
  totalData: number;
  items: number;
  itemsPerPage: number;
  data: T;
}