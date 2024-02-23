import { PublicUserDto } from '../../auth/dto/public-user.dto';
import { Membership, Role } from '../membership.entity';

export class PublicMembershipDto {
  id: number;

  user: PublicUserDto;

  role: Role;

  constructor(membership: Membership) {
    this.id = membership.id;
    this.user = new PublicUserDto(membership.user);
    this.role = membership.role;
  }
}
