import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

import { CreateGroupDto } from './dto/create-group.dto';
import { GetGroupFilterDto } from './dto/get-group-filter.dto';
import { PublicGroupDto } from './dto/public-group.dto';
import {
  UpdateGroupDateDto,
  UpdateGroupDescriptionDto,
  UpdateGroupNameDto,
} from './dto/update-group.dto';
import { Group } from './group.entity';
import { GroupRepository } from './group.repository';
import { Membership, Role } from '../membership/membership.entity';
import { User } from '../user/user.entity';

@Injectable()
export class GroupService {
  constructor(private groupRepository: GroupRepository) {}

  async getGroups(
    filterDto: GetGroupFilterDto,
    user: User,
  ): Promise<PublicGroupDto[]> {
    const { search } = filterDto;

    let query = this.groupRepository.getGroups(user);

    if (search) {
      query = query.andWhere(
        'group.name LIKE :searchQuery OR group.description LIKE :searchQuery',
        { searchQuery: `%${search}%` },
      );
    }

    try {
      const groups = await query.getMany();
      return groups.map((group: Group) => new PublicGroupDto(group));
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async getGroupById(id: number, user: User): Promise<Group> {
    const group = await this.groupRepository.getGroupById(id, user);

    if (!group) {
      throw new NotFoundException(`Group with ID ${id} not found`);
    }

    return group;
  }

  async createGroup(
    createGroupDto: CreateGroupDto,
    user: User,
  ): Promise<PublicGroupDto> {
    const { name, description } = createGroupDto;

    const membership = new Membership();
    membership.user = user;
    membership.role = Role.ADMIN;

    const group = new Group();
    membership.group = group;
    group.name = name;
    group.description = description;
    group.memberships = [membership];
    group.dueDate = createGroupDto.dueDate;
    await group.save();
    await membership.save();

    return new PublicGroupDto(group);
  }

  async deleteGroup(id: number, user: User) {
    const group = await this.getGroupById(id, user);

    if (!group || !(group.memberships && group.memberships.length > 0)) {
      throw new NotFoundException(`Impossible to delete the group ${id}`);
    }

    if (!group.isAdmin(user.username)) {
      throw new ForbiddenException(
        'You do not have the right to delete the group ${id}',
      );
    }
    await this.groupRepository.manager.transaction(
      async (transactionalEntityManager) => {
        for (const membership of group.memberships) {
          await transactionalEntityManager.remove(membership);
        }
        await transactionalEntityManager.remove(group);
      },
    );
  }

  async updateGroupName(
    id: number,
    user: User,
    updateGroupNameDto: UpdateGroupNameDto,
  ) {
    const { name } = updateGroupNameDto;
    const group = await this.getGroupById(id, user);

    if (!group.isAdmin(user.username)) {
      throw new ForbiddenException(
        'You do not have the right to delete the group ${id}',
      );
    }
    group.name = name;
    await group.save();
    return new PublicGroupDto(group);
  }

  async updateGroupDescription(
    id: number,
    user: User,
    updateGroupDescriptionDto: UpdateGroupDescriptionDto,
  ) {
    const { description } = updateGroupDescriptionDto;
    const group = await this.getGroupById(id, user);

    if (!group.isAdmin(user.username)) {
      throw new ForbiddenException(
        'You do not have the right to delete the group ${id}',
      );
    }
    group.description = description;
    await group.save();
    return new PublicGroupDto(group);
  }

  async updateGroupDate(
    id: number,
    user: User,
    updateGroupDateDto: UpdateGroupDateDto,
  ) {
    const { dueDate } = updateGroupDateDto;
    const group = await this.getGroupById(id, user);

    if (!group.isAdmin(user.username)) {
      throw new ForbiddenException(
        'You do not have the right to delete the group ${id}',
      );
    }
    group.dueDate = dueDate;
    await group.save();
    return new PublicGroupDto(group);
  }
}
