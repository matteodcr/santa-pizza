import { PublicUserDto } from '../../auth/dto/public-user.dto';
import { Group } from '../group.entity';
import { User } from '../../auth/user.entity';
import { Membership } from '../../membership/membership.entity';
import { PublicMembershipDto } from '../../membership/dto/public-membership.dto';

export class PublicGroupDto {
  id: number;

  name: string;

  description: string;

  memberhips: PublicMembershipDto[];

  dueDate: Date;

  createdAt: Date;

  constructor(group: Group) {
    this.id = group.id;
    this.name = group.name;
    this.description = group.description;
    this.memberhips = group.memberships.map(
      (membership: Membership) => new PublicMembershipDto(membership),
    );
    this.dueDate = group.dueDate;
    this.createdAt = group.createdAt;
  }
}
