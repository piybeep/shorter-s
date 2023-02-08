import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
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
