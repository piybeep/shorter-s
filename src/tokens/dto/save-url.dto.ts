import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsOptional,
  IsUrl,
  IsInt,
  IsPositive,
  IsStrongPassword,
  IsDateString,
  MinDate,
  IsDate,
} from 'class-validator';

export class SaveUrlDto {
  @ApiProperty()
  @IsUrl()
  url: string;

  @ApiPropertyOptional()
  @Transform(({value})=>value&&new Date(value))
  @IsDate()
  @MinDate(new Date())
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
