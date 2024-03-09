import { ApiProperty } from '@nestjs/swagger';

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

  constructor(membership: Membership) {
    this.id = membership.id;
    this.user = new PublicUserDto(membership.user);
    this.role = membership.role;
  }
}
