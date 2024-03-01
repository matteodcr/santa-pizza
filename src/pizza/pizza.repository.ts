import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { Pizza } from './pizza.entity';
import { Group } from '../group/group.entity';
import { User } from '../user/user.entity';

@Injectable()
export class PizzaRepository extends Repository<Pizza> {
  constructor(private dataSource: DataSource) {
    super(Pizza, dataSource.createEntityManager());
  }
  async getPizzas(user: User): Promise<Pizza[]> {
    let pizzas: Pizza[];
    try {
      pizzas = await this.createQueryBuilder('pizza')
        .leftJoinAndSelect('pizza.group', 'group')
        .leftJoinAndSelect('group.memberships', 'membership')
        .leftJoinAndSelect('membership.user', 'user')
        .leftJoinAndSelect('pizza.santa', 'santa')
        .leftJoinAndSelect('pizza.receiver', 'receiver')
        .addSelect('user.username')
        .addSelect('user.id')
        .where('membership.user = :userId', { userId: user.id })
        .getMany();
    } catch (e) {
      throw new InternalServerErrorException();
    }
    if (!pizzas) {
      throw new NotFoundException('No pizzas found');
    }
    return pizzas;
  }

  async getPizzaById(id: number, user: User): Promise<Pizza | undefined> {
    let pizza: Pizza;
    try {
      pizza = await this.createQueryBuilder('pizza')
        .leftJoinAndSelect('pizza.santa', 'santa')
        .leftJoinAndSelect('pizza.receiver', 'receiver')
        .leftJoinAndSelect('pizza.group', 'group')
        .leftJoinAndSelect('group.memberships', 'groupMemberships')
        .where('pizza.id = :id', { id })
        .andWhere('(pizza.santaId = :userId OR pizza.receiverId = :userId)', {
          userId: user.id,
        })
        .getOne();
    } catch (e) {
      throw new InternalServerErrorException();
    }
    if (!pizza) {
      throw new NotFoundException(`Pizza with ID ${id} not found`);
    }
    return pizza;
  }

  async isUserSantaInGroup(user: User, group: Group): Promise<boolean> {
    let pizzaWithUserAsSanta: Pizza;
    try {
      pizzaWithUserAsSanta = await this.createQueryBuilder('pizza')
        .where('pizza.santaId = :userId', { userId: user.id })
        .andWhere('pizza.groupId = :groupId', { groupId: group.id })
        .getOne();
    } catch (e) {
      throw new InternalServerErrorException();
    }
    return !!pizzaWithUserAsSanta;
  }

  async isUserReceiverInGroup(user: User, group: Group): Promise<boolean> {
    let pizzaWithUserAsReceiver: Pizza;
    try {
      pizzaWithUserAsReceiver = await this.createQueryBuilder('pizza')
        .where('pizza.receiverId = :userId', { userId: user.id })
        .andWhere('pizza.groupId = :groupId', { groupId: group.id })
        .getOne();
    } catch (e) {
      throw new InternalServerErrorException();
    }
    return !!pizzaWithUserAsReceiver;
  }

  async findSent(user: User): Promise<Pizza[]> {
    return await this.createQueryBuilder('pizza')
      .where('pizza.santa = :userId', { userId: user.id })
      .getMany();
  }

  async findReceived(user: User): Promise<Pizza[]> {
    return await this.createQueryBuilder('pizza')
      .where('pizza.receiver = :userId', { userId: user.id })
      .getMany();
  }
}
