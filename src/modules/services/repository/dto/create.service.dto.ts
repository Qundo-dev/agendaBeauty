import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateServiceDto {
  @ApiProperty({ required: true, example: 'Manicuria completa' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ required: true, example: 60 })
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  time: number;

  @ApiProperty({ required: true, example: 15000 })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({ required: false, example: true, default: true })
  @IsOptional()
  @IsBoolean()
  enable?: boolean;

  @ApiProperty({ required: true, example: 1 })
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  businessId: number;
}