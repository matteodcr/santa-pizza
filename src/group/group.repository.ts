import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { Group } from './group.entity';
import { User } from '../user/user.entity';

@Injectable()
export class GroupRepository extends Repository<Group> {
  constructor(private dataSource: DataSource) {
    super(Group, dataSource.createEntityManager());
  }
  getGroups(user: User) {
    return this.createQueryBuilder('group')
      .innerJoin('group.memberships', 'membership')
      .innerJoin('membership.user', 'user')
      .where('user.id = :userId', { userId: user.id })
      .leftJoinAndSelect('group.memberships', 'groupMembership')
      .leftJoinAndSelect('groupMembership.user', 'groupUser');
  }

  async getGroupById(id: number, user: User): Promise<Group> {
    let group: Group;
    try {
      group = await this.getGroups(user)
        .andWhere('group.id = :groupId', { groupId: id })
        .getOne();
      console.log(group.memberships);
    } catch (e) {
      throw new InternalServerErrorException();
    }
    if (!group) {
      throw new NotFoundException(`Group with ID ${id} not found`);
    }
    return group;
  }
}
