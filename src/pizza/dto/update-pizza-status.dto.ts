import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';

import { PizzaStatus } from '../pizza-status.enum';

export class UpdatePizzaStatusDto {
  @ApiProperty({
    description: 'The new status of the pizza',
    example: 'ASSOCIATED',
    enum: PizzaStatus,
  })
  @IsEnum(PizzaStatus)
  status: string;
}
