import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { GetGroupFilterDto } from './dto/get-group-filter.dto';
import { Group } from './group.entity';
import { User } from '../user/user.entity';

@Injectable()
export class GroupRepository extends Repository<Group> {
  private logger = new Logger('GroupRepository');
  constructor(private dataSource: DataSource) {
    super(Group, dataSource.createEntityManager());
  }

  baseQuery(user: User) {
    return this.createQueryBuilder('group')
      .innerJoin('group.memberships', 'membership')
      .innerJoin('membership.user', 'user')
      .where('user.id = :userId', { userId: user.id })
      .leftJoinAndSelect('group.memberships', 'groupMembership')
      .leftJoinAndSelect('groupMembership.user', 'groupUser')
      .leftJoinAndSelect('groupMembership.santaPizza', 'santaPizza')
      .leftJoinAndSelect(
        'santaPizza.receiverMembership',
        'receiverMembership',
        'groupUser.id = :userId',
      )
      .leftJoinAndSelect('receiverMembership.user', 'receiverUser');
  }

  async getGroups(filterDto: GetGroupFilterDto, user: User): Promise<Group[]> {
    const { search } = filterDto;

    let query = this.baseQuery(user);

    if (search) {
      query = query.andWhere(
        'group.name LIKE :searchQuery OR group.description LIKE :searchQuery',
        { searchQuery: `%${search}%` },
      );
    }

    try {
      return await query.getMany();
    } catch (error) {
      this.logger.error(
        `Failed to get groups for user "${user.username}", Filters: ${JSON.stringify(
          filterDto,
        )}, Data:`,
        error.stack,
      );
      throw new InternalServerErrorException();
    }
  }

  async getGroupById(id: number, user: User): Promise<Group> {
    let group: Group;
    try {
      group = await this.baseQuery(user)
        .andWhere('group.id = :groupId', { groupId: id })
        .getOne();
    } catch (e) {
      this.logger.error(`Failed to get group with ID ${id}`, e);
      throw new InternalServerErrorException();
    }
    if (!group) {
      this.logger.debug(`Group with ID ${id} not found`);
      throw new NotFoundException(`Group with ID ${id} not found`);
    }
    return group;
  }
}
