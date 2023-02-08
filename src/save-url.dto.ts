import { IsOptional, IsUrl } from 'class-validator';
import { IsDate, IsInt, IsPositive, IsStrongPassword } from 'class-validator';

export class SaveUrlDto {
  @IsUrl()
  url: string;

  @IsDate()
  @IsOptional()
  deathAfter?: Date;

  @IsStrongPassword()
  @IsOptional()
  password?: string;

  @IsInt()
  @IsPositive()
  @IsOptional()
  connectQty?: number;
}
