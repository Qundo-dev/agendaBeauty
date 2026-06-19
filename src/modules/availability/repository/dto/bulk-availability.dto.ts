import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsInt, IsNotEmpty, Min, ValidateNested } from 'class-validator';
import { CreateAvailabilityItemDto } from './create-availability-item.dto';

export class BulkAvailabilityDto {
  @ApiProperty({ required: true, example: 1 })
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  businessId: number;

  @ApiProperty({
    required: true,
    type: [CreateAvailabilityItemDto],
    example: [
      { dayOfWeek: 1, startTime: '09:00', endTime: '18:00' },
      { dayOfWeek: 2, startTime: '09:00', endTime: '18:00' },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateAvailabilityItemDto)
  availabilities: CreateAvailabilityItemDto[];
}