import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDate,
  IsOptional,
  IsUrl,
  IsInt,
  IsPositive,
  IsStrongPassword,
  IsDateString,
} from 'class-validator';

export class SaveUrlDto {
  @ApiProperty()
  @IsUrl()
  url: string;

  @ApiPropertyOptional()
  // @IsDate()
  @IsDateString()
  @IsOptional()
  deathDate?: Date;

  @ApiPropertyOptional()
  @IsStrongPassword()
  @IsOptional()
  password?: string;

  @ApiPropertyOptional()
  @IsInt()
  @IsPositive()
  @IsOptional()
  connectQty?: number;
}
