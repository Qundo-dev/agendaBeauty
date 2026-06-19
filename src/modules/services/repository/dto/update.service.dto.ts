import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class UpdateServiceDto {
  @ApiProperty({ required: false, example: 'Manicuria completa' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ required: false, example: 60 })
  @IsOptional()
  @IsInt()
  @Min(1)
  time?: number;

  @ApiProperty({ required: false, example: 15000 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @ApiProperty({ required: false, example: true })
  @IsOptional()
  @IsBoolean()
  enable?: boolean;

  @ApiProperty({ required: false, example: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  businessId?: number;
}