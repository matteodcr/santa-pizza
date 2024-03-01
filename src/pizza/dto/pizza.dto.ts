import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

import { IsDifferent } from '../pipes/is-different.pipe';
import { PizzaStatus } from '../pizza-status.enum';

export class PizzaDto {
  @ApiProperty({
    example: 4,
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  groupId: number;

  @ApiProperty({
    example: 'Marc',
    required: true,
    description: 'The person who will give the pizza.',
  })
  @IsNotEmpty()
  @IsString()
  @IsDifferent('receiver', { message: 'Santa must be different from receiver' })
  santa: string;

  @ApiProperty({
    example: 'Daniel',
    required: true,
    description:
      'The person who will receive the pizza, must be different from santa.',
  })
  @IsNotEmpty()
  @IsString()
  receiver: string;

  @ApiProperty({
    example: 'ASSOCIATED',
    required: true,
    enum: PizzaStatus,
  })
  @IsNotEmpty()
  @IsString()
  status: string[];
}
