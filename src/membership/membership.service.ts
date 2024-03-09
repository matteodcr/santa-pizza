import {
  ForbiddenException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';

import { JoinRemoveGroupDto } from './dto/join-remove-group.dto';
import { GroupRole, Membership } from './membership.entity';
import { MembershipRepository } from './membership.repository';
import { PublicGroupDto } from '../group/dto/public-group.dto';
import { GroupRepository } from '../group/group.repository';
import { User } from '../user/user.entity';
import { UserRepository } from '../user/user.repository';

@Injectable()
export class MembershipService {
  private logger = new Logger('MembershipService');
  constructor(
    private membershipRepository: MembershipRepository,
    private groupRepository: GroupRepository,
    private userRepository: UserRepository,
  ) {}
  async addUserToGroup(
    user: User,
    joinRemoveGroupDto: JoinRemoveGroupDto,
  ): Promise<PublicGroupDto> {
    const group = await this.groupRepository.getGroupById(
      joinRemoveGroupDto.groupId,
      user,
    );

    const destUser = await this.userRepository.getUser(
      joinRemoveGroupDto.username,
    );

    if (!group.isAdmin(user.username)) {
      throw new UnauthorizedException(
        'You must be an admin of the group to add members',
      );
    }

    if (await this.membershipRepository.isMemberOf(destUser, group)) {
      throw new UnauthorizedException(
        'This user is already a member of this group',
      );
    }

    const newMembership = new Membership();
    newMembership.user = destUser;
    newMembership.groupId = joinRemoveGroupDto.groupId;
    newMembership.role = GroupRole.USER; // or whatever default role you want to assign
    group.memberships.push(newMembership);

    await this.membershipRepository.save(newMembership);

    this.logger.debug(`User ${destUser.username} added to group ${group.id}`);

    return new PublicGroupDto(group);
  }

  async removeUserFromGroup(
    user: User,
    joinRemoveGroupDto: JoinRemoveGroupDto,
  ): Promise<PublicGroupDto> {
    const group = await this.groupRepository.getGroupById(
      joinRemoveGroupDto.groupId,
      user,
    );

    const destUser = await this.userRepository.getUser(
      joinRemoveGroupDto.username,
    );

    if (
      !group.isAdmin(user.username) ||
      !(user.username === joinRemoveGroupDto.username)
    ) {
      throw new ForbiddenException(
        'You do not have the right to remove an user in the group ${id}',
      );
    }

    const membership = await this.membershipRepository.getMembership(
      destUser,
      group,
    );
    await this.membershipRepository.remove(membership);
    this.logger.debug(
      `User ${destUser.username} removed from group ${group.id}`,
    );

    return new PublicGroupDto(group);
  }
}
