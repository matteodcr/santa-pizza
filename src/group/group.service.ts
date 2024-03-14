import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  Logger,
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
      this.logger.verbose(
        `Got groups ${groups.map((group) => group.id + ',')} `,
      );
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

    this.logger.debug(`Created group ${group.id} for user ${user.username}`);

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
        await transactionalEntityManager.delete('Pizza', {
          group: { id: group.id },
        });
        await transactionalEntityManager.delete('Membership', {
          group: { id: group.id },
        });

        await transactionalEntityManager.delete(Group, group.id);
      },
    );
    this.logger.debug(`Deleted group ${id} by user ${user.username}`);
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
    this.logger.debug(`Updated group name ${id} by user ${user.username}`);
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
    this.logger.debug(
      `Updated group description ${id} by user ${user.username}`,
    );
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
    this.logger.debug(`Updated group due date ${id} by user ${user.username}`);
    return new PublicGroupDto(group);
  }

  async associatePizzasByUser(id: number, user: User) {
    const group = await this.groupRepository.getGroupById(id, user);
    if (group.isAdmin(user.username)) {
      return await this.associatePizzas(group);
    } else {
      throw new ForbiddenException(
        'You do not have the right to associate pizzas',
      );
    }
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

            availablePizza.receiverMembership = member;
            availablePizza.status = PizzaStatus.ASSOCIATED;
            assignedPizzas.push(availablePizza);

            await transactionalEntityManager.save(availablePizza);
          }
          group.status = GroupStatus.ASSOCIATED;
          await transactionalEntityManager.save(group);
        } else {
          this.logger.verbose('Not enough members to associate pizzas');
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
      throw new InternalServerErrorException(
        'Not enough available pizzas to assign.',
      );
    }

    return availablePizzas[Math.floor(Math.random() * availablePizzas.length)];
  }
}
