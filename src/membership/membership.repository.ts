import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { Membership } from './membership.entity';
import { Group } from '../group/group.entity';
import { User } from '../user/user.entity';

@Injectable()
export class MembershipRepository extends Repository<Membership> {
  constructor(private dataSource: DataSource) {
    super(Membership, dataSource.createEntityManager());
  }

  async getMembership(user: User, group: Group): Promise<Membership | null> {
    let membership: Membership;
    try {
      membership = await this.findOne({
        where: { userId: user.id, groupId: group.id },
      });
    } catch (e) {
      throw new InternalServerErrorException();
    }
    if (!membership) {
      throw new NotFoundException('Membership not found');
    }
    return membership;
  }
  async isMemberOf(user: User, group: Group): Promise<boolean> {
    const membership = await this.findOne({
      where: { userId: user.id, groupId: group.id },
    });
    return !!membership;
  }
}
