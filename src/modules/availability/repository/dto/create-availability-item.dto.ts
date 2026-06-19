import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString, Matches, Max, Min } from 'class-validator';

export class CreateAvailabilityItemDto {
  @ApiProperty({ required: true, example: 1, description: '0=domingo, 6=sabado' })
  @IsNotEmpty()
  @IsInt()
  @Min(0)
  @Max(6)
  dayOfWeek: number;

  @ApiProperty({ required: true, example: '09:00' })
  @IsNotEmpty()
  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
  startTime: string;

  @ApiProperty({ required: true, example: '18:00' })
  @IsNotEmpty()
  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
  endTime: string;
}