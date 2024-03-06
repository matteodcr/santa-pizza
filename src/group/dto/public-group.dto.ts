import { ApiProperty } from '@nestjs/swagger';

import { PublicMembershipDto } from '../../membership/dto/public-membership.dto';
import { Membership } from '../../membership/membership.entity';
import { Group } from '../group.entity';

export class PublicGroupDto {
  @ApiProperty({ description: 'The id of the group', example: 2 })
  id: number;

  @ApiProperty({
    description: 'The name of the group',
    example: 'New Year Party',
  })
  name: string;

  @ApiProperty({
    description: 'The description of the group',
    example: 'It will be a great party!',
  })
  description: string;

  @ApiProperty({
    description: 'The users in the group',
    isArray: true,
    type: PublicMembershipDto,
  })
  memberships: PublicMembershipDto[];

  @ApiProperty({ description: 'The date of the end of the group', type: Date })
  dueDate: Date;

  @ApiProperty({
    description: 'The date of the creation of the group',
    type: Date,
  })
  createdAt: Date;

  constructor(group: Group) {
    this.id = group.id;
    this.name = group.name;
    this.description = group.description;
    this.memberships = group.memberships.map(
      (membership: Membership) => new PublicMembershipDto(membership),
    );
    this.dueDate = group.dueDate;
    this.createdAt = group.createdAt;
  }
}
