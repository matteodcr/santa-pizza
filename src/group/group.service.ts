import {
  Injectable,
  NotFoundException,
  Query,
  UnauthorizedException,
} from '@nestjs/common';
import { GroupRepository } from './group.repository';
import { GetGroupFilterDto } from './dto/get-group-filter.dto';
import { User } from '../auth/user.entity';
import { CreateGroupDto } from './dto/create-group.dto';
import { Group } from './group.entity';
import { PublicGroupDto } from './dto/public-group.dto';

@Injectable()
export class GroupService {
  constructor(private groupRepository: GroupRepository) {}

  async getGroups(filterDto: GetGroupFilterDto, user: User) {
    return this.groupRepository.getGroups(filterDto, user);
  }

  async getGroupById(id: number, user: User) {
    return this.groupRepository.getGroupById(id, user);
  }

  async createGroup(
    createGroupDto: CreateGroupDto,
    user: User,
  ): Promise<PublicGroupDto> {
    const { name, description } = createGroupDto;

    const group = new Group();
    group.name = name;
    group.description = description;
    group.users = [user];
    await this.groupRepository.save(group);
    return new PublicGroupDto(group);
  }

  async deleteGroup(id: number, user: User) {
    return this.groupRepository.deleteGroup(id, user);
  }

  // async updateGroupName(id: number, user: User) {}
}
