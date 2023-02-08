import { ApiProperty } from '@nestjs/swagger';
import { ApiPropertyOptional } from '@nestjs/swagger/dist';
import { IsOptional, IsUrl } from 'class-validator';
import { IsDate, IsInt, IsPositive, IsStrongPassword } from 'class-validator';

export class SaveUrlDto {
  @ApiProperty()
  @IsUrl()
  url: string;

  @ApiPropertyOptional()
  @IsDate()
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
