import { IsEmail, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateBusinessDto {
  @ApiProperty({ required: false, example: 'Beauty Flow Studio' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ required: false, example: 'contacto@beautyflow.com' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ required: false, example: 'beauty-flow-studio' })
  @IsOptional()
  @IsString()
  slug?: string;

  @ApiProperty({ required: false, example: '+54 11 5555 5555' })
  @IsOptional()
  @IsString()
  phone?: string;
}