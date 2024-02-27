import { IsNotEmpty, IsString, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDifferent } from '../pipes/is-different.pipe';

export class PizzaDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  groupId: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsDifferent('receiver', { message: 'Santa must be different from receiver' })
  santa: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  receiver: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  status: string;
}
