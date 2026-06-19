import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class CreateEmployeeDto {
  @ApiProperty({ required: true, example: 'Maria Gomez' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ required: true, example: 1 })
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  businessId: number;
}