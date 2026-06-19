import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBusinessDto {
  @ApiProperty({ required: true, example: 'Beauty Flow Studio' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ required: true, example: 'contacto@beautyflow.com' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ required: true, example: 'beauty-flow-studio' })
  @IsNotEmpty()
  @IsString()
  slug: string;

  @ApiProperty({ required: false, example: '+54 11 5555 5555' })
  @IsOptional()
  @IsString()
  phone?: string;
}