import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { Membership } from './membership.entity';
import { Group } from '../group/group.entity';
import { User } from '../user/user.entity';

@Injectable()
export class MembershipRepository extends Repository<Membership> {
  private logger = new Logger('MembershipRepository');
  constructor(private dataSource: DataSource) {
    super(Membership, dataSource.createEntityManager());
  }

  async getMembership(user: User, group: Group): Promise<Membership | null> {
    let membership: Membership;
    try {
      membership = await this.createQueryBuilder('membership')
        .where('membership.userId = :userId', { userId: user.id })
        .andWhere('membership.groupId = :groupId', { groupId: group.id })
        .leftJoinAndSelect('membership.santaPizza', 'santaPizza')
        .leftJoinAndSelect('membership.receiverPizza', 'receiverPizza')
        .leftJoinAndSelect('membership.user', 'user')
        .leftJoinAndSelect('membership.group', 'group')
        .getOne();
    } catch (e) {
      this.logger.error(
        `Failed to get membership for user "${user.username}" in group "${group.name}". Data: ${e.stack}`,
      );
      throw new InternalServerErrorException();
    }
    if (!membership) {
      this.logger.warn(
        `No membership found for user ${user.username} in group ${group.id}`,
      );
      throw new NotFoundException('No membership found');
    }
    return membership;
  }

  async getAllMemberships(group: Group): Promise<Membership[]> {
    let memberships: Membership[];
    try {
      memberships = await this.createQueryBuilder('membership')
        .leftJoinAndSelect('membership.user', 'user')
        .where('membership.groupId = :groupId', { groupId: group.id })
        .getMany();
    } catch (e) {
      this.logger.error(
        `Failed to get memberships for group "${group.name}". Data: ${e.stack}`,
      );
      throw new InternalServerErrorException();
    }
    if (!memberships) {
      this.logger.warn(`No memberships found for group ${group.id}`);
      throw new NotFoundException('No memberships found');
    }
    return memberships;
  }
  async isMemberOf(user: User, group: Group): Promise<boolean> {
    const membership = await this.findOne({
      where: { userId: user.id, groupId: group.id },
    });
    return !!membership;
  }
}
