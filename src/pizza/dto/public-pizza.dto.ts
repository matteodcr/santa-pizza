import { ApiProperty } from '@nestjs/swagger';

import { PublicUserDto } from '../../user/dto/public-user.dto';
import { PizzaStatus } from '../pizza-status.enum';
import { Pizza } from '../pizza.entity';

export class PublicPizzaDto {
  @ApiProperty({
    example: 2,
  })
  id: number;

  @ApiProperty({
    example: 15,
  })
  groupId: number;

  @ApiProperty({
    type: PublicUserDto,
  })
  santa: PublicUserDto;

  @ApiProperty({
    type: PublicUserDto,
  })
  receiver: PublicUserDto;

  @ApiProperty({
    example: 'ASSOCIATED',
    enum: PizzaStatus,
  })
  status: string;

  constructor(pizza: Pizza) {
    this.id = pizza.id;
    this.groupId = pizza.group.id;
    this.santa = new PublicUserDto(pizza.santa);
    this.receiver = new PublicUserDto(pizza.receiver);
    this.status = pizza.status;
  }
}
