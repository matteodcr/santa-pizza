import { ApiProperty } from '@nestjs/swagger';

import { PublicPizzaDto } from '../../pizza/dto/public-pizza.dto';
import { Pizza } from '../../pizza/pizza.entity';
import { PublicUserDto } from '../../user/dto/public-user.dto';
import { GroupRole, Membership } from '../membership.entity';

export class PublicMembershipDto {
  @ApiProperty({
    example: 4,
  })
  id: number;

  user: PublicUserDto;

  @ApiProperty({
    example: 'ADMIN',
    enum: GroupRole,
  })
  role: GroupRole;

  @ApiProperty({
    type: PublicPizzaDto,
  })
  santaPizza: Pizza;

  @ApiProperty({
    type: PublicPizzaDto,
  })
  receiverPizza?: Pizza;

  constructor(membership: Membership) {
    this.id = membership.id;
    this.user = new PublicUserDto(membership.user);
    this.role = membership.role;
    this.santaPizza = membership.santaPizza;
    this.receiverPizza = membership?.receiverPizza;
  }
}
