import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class UpdateEmployeeDto {
  @ApiProperty({ required: false, example: 'Maria Gomez' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ required: false, example: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  businessId?: number;
}