import { ApiProperty } from '@nestjs/swagger';

import { PublicMembershipDto } from '../../membership/dto/public-membership.dto';
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
  santa: PublicMembershipDto;

  @ApiProperty({
    type: PublicUserDto,
  })
  receiver: PublicMembershipDto;

  @ApiProperty({
    example: 'ASSOCIATED',
    enum: PizzaStatus,
  })
  status: string;

  constructor(pizza: Pizza) {
    this.id = pizza.id;
    this.groupId = pizza.group.id;
    this.santa = new PublicMembershipDto(pizza.santaMembership);
    this.receiver = new PublicMembershipDto(pizza.receiverMembership);
    this.status = pizza.status;
  }
}
