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
      .innerJoinAndSelect('group.memberships', 'membership')
      .innerJoin('membership.user', 'user')
      .addSelect(['user.username', 'user.id'])
      .where('user.id = :userId', { userId: user.id });
  }

  async getGroupById(id: number, user: User): Promise<Group> {
    let group: Group;
    try {
      group = await this.getGroups(user)
        .andWhere('group.id = :groupId', { groupId: id })
        .getOne();
    } catch (e) {
      throw new InternalServerErrorException();
    }
    if (!group) {
      throw new NotFoundException(`Group with ID ${id} not found`);
    }
    return group;
  }
}
