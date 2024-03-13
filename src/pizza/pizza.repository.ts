import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { PizzaStatus } from './pizza-status.enum';
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
        .leftJoinAndSelect('pizza.santaMembership', 'santa')
        .leftJoinAndSelect('pizza.receiverMembership', 'receiver')
        .leftJoinAndSelect('santa.user', 'santaUser')
        .leftJoinAndSelect('receiver.user', 'receiverUser')
        .where('santaUser.id = :userId', { userId: user.id })
        .getMany();
    } catch (e) {
      throw new InternalServerErrorException();
    }
    if (!pizzas) {
      throw new NotFoundException('No pizzas found');
    }
    return pizzas;
  }

  async getPizzasOfGroup(group: Group): Promise<Pizza[]> {
    let pizzas: Pizza[];
    try {
      pizzas = await this.createQueryBuilder('pizza')
        .leftJoinAndSelect('pizza.group', 'group')
        .where('group.id = :groupId', { groupId: group.id })
        .getMany();
    } catch (e) {
      throw new InternalServerErrorException();
    }
    if (!pizzas) {
      throw new NotFoundException('No pizzas found');
    }
    return pizzas;
  }

  async findPizzasWithOpenStatusAndDifferentSanta(
    member: User,
  ): Promise<Pizza[]> {
    let pizzas: Pizza[];

    try {
      pizzas = await this.createQueryBuilder('pizza')
        .innerJoinAndSelect('pizza.santaMembership', 'santaMembership')
        .where('pizza.status = :status', { status: PizzaStatus.OPEN })
        .andWhere('santaMembership.userId != :userId', { userId: member.id })
        .getMany();
    } catch (e) {
      throw new InternalServerErrorException();
    }

    return pizzas;
  }

  async getPizzaById(id: number, user: User): Promise<Pizza | undefined> {
    let pizza: Pizza;
    try {
      pizza = await this.findOneBy({ id: id });
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
