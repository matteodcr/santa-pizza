import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';

import { ChangeRoleDto } from './dto/change-role.dto';
import { JoinRemoveGroupDto } from './dto/join-remove-group.dto';
import { GroupRole, Membership } from './membership.entity';
import { MembershipRepository } from './membership.repository';
import { PublicGroupDto } from '../group/dto/public-group.dto';
import { GroupRepository } from '../group/group.repository';
import { PizzaStatus } from '../pizza/pizza-status.enum';
import { Pizza } from '../pizza/pizza.entity';
import { PizzaRepository } from '../pizza/pizza.repository';
import { User } from '../user/user.entity';
import { UserRepository } from '../user/user.repository';

@Injectable()
export class MembershipService {
  private logger = new Logger('MembershipService');
  constructor(
    private membershipRepository: MembershipRepository,
    private groupRepository: GroupRepository,
    private pizzaRepository: PizzaRepository,
    private userRepository: UserRepository,
  ) {}
  async addUserToGroup(
    user: User,
    joinRemoveGroupDto: JoinRemoveGroupDto,
  ): Promise<PublicGroupDto> {
    try {
      const group = await this.groupRepository.getGroupById(
        joinRemoveGroupDto.groupId,
        user,
      );

      const destUser = await this.userRepository.getUser(
        joinRemoveGroupDto.username,
      );

      if (!group.isAdmin(user.username)) {
        this.logger.warn(`User ${user.username} is not an admin of the group`);
        throw new ForbiddenException(
          'You must be an admin of the group to add members',
        );
      }

      if (await this.membershipRepository.isMemberOf(destUser, group)) {
        this.logger.warn(
          `User ${destUser.username} is already a member of the group`,
        );
        throw new ForbiddenException(
          'This user is already a member of this group',
        );
      }

      const newMembership = new Membership();
      newMembership.user = destUser;
      newMembership.groupId = joinRemoveGroupDto.groupId;
      newMembership.role = GroupRole.USER;
      group.memberships.push(newMembership);

      const pizza = new Pizza();
      pizza.santaMembership = newMembership;
      pizza.group = group;
      pizza.status = PizzaStatus.OPEN;

      await this.groupRepository.manager.transaction(
        async (transactionalEntityManager) => {
          await transactionalEntityManager.save(newMembership);
          await transactionalEntityManager.save(pizza);
        },
      );

      this.logger.verbose(
        `User ${destUser.username} added to group ${group.id}`,
      );
      return new PublicGroupDto(group);
    } catch (error) {
      this.logger.error('Transaction failed:', error.message);
      throw new InternalServerErrorException('Failed to add user to group');
    }
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
      user.username === joinRemoveGroupDto.username ||
      group.isAdmin(joinRemoveGroupDto.username)
    ) {
      throw new ForbiddenException(
        'You do not have the right to remove a user from the group ${id}',
      );
    }

    const membership = await this.membershipRepository.getMembership(
      destUser,
      group,
    );

    await this.groupRepository.manager.transaction(
      async (transactionalEntityManager) => {
        try {
          await transactionalEntityManager.remove(membership.santaPizza);
          await transactionalEntityManager.remove(membership);
        } catch (e) {
          this.logger.error(
            `Failed to remove user ${user.username} from group ${group.id}: ${e.stack}`,
          );
          throw new InternalServerErrorException(
            `Failed to remove user ${user.username} from group ${group.id}`,
          );
        }
      },
    );

    this.logger.verbose(
      `User ${destUser.username} removed from group ${group.id}`,
    );

    return new PublicGroupDto(group);
  }

  async changeRole(user: User, changeRoleDto: ChangeRoleDto) {
    const userToModify = await this.userRepository.getUser(
      changeRoleDto.username,
    );

    const group = await this.groupRepository.getGroupById(
      changeRoleDto.groupId,
      user,
    );

    const membership = await this.membershipRepository.getMembership(
      userToModify,
      group,
    );

    if (!group.isAdmin(user.username) || membership.role === GroupRole.ADMIN) {
      this.logger.debug(`User ${user.username} is not an admin of the group`);
      throw new ForbiddenException(
        `You do not have the right to change the role of an user in the group ${changeRoleDto.groupId}`,
      );
    }
    membership.role = changeRoleDto.role;
    try {
      await membership.save();
    } catch (e) {
      this.logger.error(`Failed to change role: ${e.message}`);
    }
    this.logger.verbose(
      `User ${userToModify.username} role in ${group.id} changed to ${changeRoleDto.role}`,
    );
    return membership;
  }
}
