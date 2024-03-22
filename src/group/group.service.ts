import * as fs from 'fs';

import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';

import { CreateGroupDto } from './dto/create-group.dto';
import { GetGroupFilterDto } from './dto/get-group-filter.dto';
import { PublicGroupDto } from './dto/public-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { GroupStatus } from './group-status.enum';
import { Group } from './group.entity';
import { GroupRepository } from './group.repository';
import { GroupRole, Membership } from '../membership/membership.entity';
import { MembershipRepository } from '../membership/membership.repository';
import { PizzaStatus } from '../pizza/pizza-status.enum';
import { Pizza } from '../pizza/pizza.entity';
import { PizzaRepository } from '../pizza/pizza.repository';
import { User } from '../user/user.entity';
import { shuffleArray } from '../utils/ShuffleArray';

@Injectable()
export class GroupService {
  private logger = new Logger('GroupService');
  constructor(
    private groupRepository: GroupRepository,
    private membershipRepository: MembershipRepository,
    private pizzaRepository: PizzaRepository,
  ) {}

  async getGroups(filterDto: GetGroupFilterDto, user: User): Promise<Group[]> {
    const groups = await this.groupRepository.getGroups(filterDto, user);
    this.logger.verbose(
      `Got groups [${groups.map((group) => group.id).join(', ')}]`,
    );
    return groups;
  }

  async getGroupById(id: number, user: User): Promise<Group> {
    const group = await this.groupRepository.getGroupById(id, user);
    this.logger.verbose(`Got group ${group.id}`);
    return group;
  }

  async createGroup(
    createGroupDto: CreateGroupDto,
    user: User,
  ): Promise<PublicGroupDto> {
    const { name, description } = createGroupDto;

    const membership = new Membership();
    membership.user = user;
    membership.role = GroupRole.ADMIN;

    const group = new Group();
    membership.group = group;
    group.name = name;
    group.description = description;
    group.memberships = [membership];
    group.dueDate = createGroupDto.dueDate;
    group.status = GroupStatus.OPEN;

    const pizza = new Pizza();
    pizza.group = group;
    pizza.santaMembership = membership;
    pizza.status = PizzaStatus.OPEN;

    try {
      await this.groupRepository.manager.transaction(
        async (transactionalEntityManager) => {
          await transactionalEntityManager.save(group);
          await transactionalEntityManager.save(membership);
          await transactionalEntityManager.save(pizza);
        },
      );
    } catch (error) {
      this.logger.error(`Failed to create group: ${error.message}`);
      throw new InternalServerErrorException('Failed to create group.');
    }

    this.logger.verbose(`Group ${group.id} created by user ${user.username}`);
    return new PublicGroupDto(group);
  }

  async deleteGroup(id: number, user: User) {
    const group = await this.groupRepository.getGroupById(id, user);

    if (!group.isAdmin(user.username)) {
      throw new ForbiddenException(
        'You do not have the right to delete the group ${id}',
      );
    }

    await this.groupRepository.manager.transaction(
      async (transactionalEntityManager) => {
        try {
          await transactionalEntityManager.delete('Pizza', {
            group: { id: group.id },
          });
          await transactionalEntityManager.delete('Membership', {
            group: { id: group.id },
          });

          await transactionalEntityManager.delete(Group, group.id);
        } catch (e) {
          this.logger.error(`Failed to delete group ${id}: ${e.message}`);
          throw new InternalServerErrorException(
            `Failed to delete group ${id}.`,
          );
        }
      },
    );

    this.logger.verbose(`Group ${id} deleted  by user ${user.username}`);
  }

  async updateGroup(id: number, user: User, updateGroupDto: UpdateGroupDto) {
    const { name, description, dueDate } = updateGroupDto;
    const group = await this.getGroupById(id, user);

    if (!group.isAdmin(user.username)) {
      this.logger.debug(
        `User ${user.username} does not have the right to update the group`,
      );
      throw new ForbiddenException(
        'You do not have the right to delete the group ${id}',
      );
    }
    if (group.name) {
      group.name = name;
    }
    if (group.description) {
      group.description = description;
    }
    if (group.dueDate) {
      group.dueDate = dueDate;
    }
    try {
      await group.save();
    } catch (e) {
      this.logger.error(`Failed to update group ${id}: ${e.stack}`);
      throw new InternalServerErrorException(`Failed to update group ${id}`);
    }
    this.logger.verbose(`Group ${id} updated by user ${user.username}`);
    return new PublicGroupDto(group);
  }

  async associatePizzasByUser(id: number, user: User) {
    const group = await this.groupRepository.getGroupById(id, user);
    if (group.isAdmin(user.username)) {
      await this.associatePizzas(group);
    } else {
      this.logger.debug(
        `User ${user.id} does not have the right to associate pizzas`,
      );
      throw new ForbiddenException(
        'You do not have the right to associate pizzas',
      );
    }
    this.logger.verbose(`Pizzas associated in group ${id} by user ${user.id}`);
  }

  async associatePizzas(group: Group): Promise<void> {
    const members = await this.membershipRepository.getAllMemberships(group);
    const membersCopy = [...members];

    shuffleArray(membersCopy);

    await this.groupRepository.manager.transaction(
      async (transactionalEntityManager) => {
        const assignedPizzas: Pizza[] = [];
        if (members.length >= 2) {
          for (const member of members) {
            const availablePizza = await this.getAvailablePizza(
              group,
              assignedPizzas,
              member,
            );
            console.log('availablePizza', availablePizza);

            availablePizza.receiverMembership = member;
            availablePizza.status = PizzaStatus.ASSOCIATED;
            assignedPizzas.push(availablePizza);

            try {
              await transactionalEntityManager.save(availablePizza);
            } catch (e) {
              this.logger.error(
                `Failed to update pizza ${availablePizza.id} to associated status: ${e.stack}`,
              );
              throw new InternalServerErrorException(
                `Failed to update pizza ${availablePizza.id} to associated status`,
              );
            }
          }
          group.status = GroupStatus.ASSOCIATED;
          try {
            await transactionalEntityManager.save(group);
          } catch (e) {
            this.logger.error(
              `Failed to update group ${group.id} to associated status: ${e.stack}`,
            );
            throw new InternalServerErrorException(
              `Failed to update group ${group.id} to associated status`,
            );
          }
        } else {
          this.logger.debug('Not enough members to associate pizzas');
        }
      },
    );
  }

  private async getAvailablePizza(
    group: Group,
    assignedPizzas: Pizza[],
    receiver: Membership,
  ): Promise<Pizza> {
    const availablePizzas =
      await this.pizzaRepository.findPizzasWithOpenStatusAndDifferentSanta(
        receiver.user,
      );

    if (availablePizzas.length === 0) {
      this.logger.debug(
        `Not enough available pizzas to assign in group ${group.id}`,
      );
      throw new InternalServerErrorException(
        'Not enough available pizzas to assign.',
      );
    }

    return availablePizzas[Math.floor(Math.random() * availablePizzas.length)];
  }

  async closeGroup(groupId: number, user: User): Promise<void> {
    const group = await this.groupRepository.getGroupById(groupId, user);
    const membership = await this.membershipRepository.getMembership(
      user,
      group,
    );

    if (!membership || membership.role !== GroupRole.ADMIN) {
      throw new ForbiddenException(
        'You do not have the right to close the group',
      );
    }

    if (
      group.status === GroupStatus.ARCHIVED ||
      group.status === GroupStatus.OPEN
    ) {
      this.logger.debug(`Group ${group.id} cannot be closed`);
      throw new ForbiddenException('The group cannot be closed');
    }
    group.status = GroupStatus.ARCHIVED;
    try {
      await this.groupRepository.save(group);
    } catch (e) {
      this.logger.error(`Failed to close group ${groupId}: ${e.stack}`);
      throw new InternalServerErrorException(
        `Failed to close group ${groupId}`,
      );
    }
    this.logger.verbose(`Group ${groupId} closed by user ${user.username}`);
  }

  public async setBackground(
    user: User,
    groupId: number,
    backgroundPath: string,
  ) {
    const group = await this.groupRepository.getGroupById(groupId, user);
    const membership = await this.membershipRepository.getMembership(
      user,
      group,
    );
    if (!membership || membership.role !== GroupRole.ADMIN) {
      this.logger.debug(
        `User ${user.username} does not have the right to update the background`,
      );
      throw new ForbiddenException(
        'You do not have the right to update the background',
      );
    }
    if (group.backgroundUrl && fs.existsSync(group.backgroundUrl)) {
      fs.unlinkSync(group.backgroundUrl);
    }
    try {
      await this.groupRepository.update(groupId, {
        backgroundUrl: backgroundPath,
      });
    } catch (e) {
      this.logger.error(
        `Failed to update background of group ${groupId}: ${e.stack}`,
      );
      throw new InternalServerErrorException(
        `Failed to update background of group ${groupId}`,
      );
    }
    this.logger.verbose(
      `Background of group ${groupId} updated by user ${user.username}`,
    );
  }
}
