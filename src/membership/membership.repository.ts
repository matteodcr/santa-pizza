import { DataSource, Repository } from 'typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Membership } from './membership.entity';
import { User } from '../auth/user.entity';
import { Group } from '../group/group.entity';
@Injectable()
export class MembershipRepository extends Repository<Membership> {
  constructor(private dataSource: DataSource) {
    super(Membership, dataSource.createEntityManager());
  }

  async getMembership(user: User, group: Group): Promise<Membership | null> {
    const membership = await this.findOne({
      where: { userId: user.id, groupId: group.id },
    });
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
