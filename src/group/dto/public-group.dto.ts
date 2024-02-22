import { PublicUserDto } from '../../auth/dto/public-user.dto';
import { Group } from '../group.entity';
import { User } from '../../auth/user.entity';

export class PublicGroupDto {
  id: number;

  name: string;

  description: string;

  users: PublicUserDto[];

  constructor(group: Group) {
    this.id = group.id;
    this.name = group.name;
    this.description = group.description;
    this.users = group.users.map((user: User) => new PublicUserDto(user));
  }
}
