import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsString } from 'class-validator';

export class UpdateShiftStatusDto {
  @ApiProperty({
    example: 'confirmed',
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
  })
  @IsString()
  @IsIn(['pending', 'confirmed', 'cancelled', 'completed'])
  status: string;
}