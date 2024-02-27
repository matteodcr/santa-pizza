import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Pizza } from './pizza.entity';
import { User } from '../auth/user.entity';
import { Group } from '../group/group.entity';

@Injectable()
export class PizzaRepository extends Repository<Pizza> {
  constructor(private dataSource: DataSource) {
    super(Pizza, dataSource.createEntityManager());
  }
  async getPizzas(user: User): Promise<Pizza[]> {
    return this.createQueryBuilder('pizza')
      .leftJoinAndSelect('pizza.group', 'group')
      .leftJoinAndSelect('group.memberships', 'membership')
      .leftJoinAndSelect('membership.user', 'user')
      .leftJoinAndSelect('pizza.santa', 'santa')
      .leftJoinAndSelect('pizza.receiver', 'receiver')
      .addSelect('user.username')
      .addSelect('user.id')
      .where('membership.user = :userId', { userId: user.id })
      .getMany();
  }

  async getPizzaById(id: number, user: User): Promise<Pizza | undefined> {
    return await this.createQueryBuilder('pizza')
      .leftJoinAndSelect('pizza.santa', 'santa')
      .leftJoinAndSelect('pizza.receiver', 'receiver')
      .leftJoinAndSelect('pizza.group', 'group')
      .leftJoinAndSelect('group.memberships', 'groupMemberships')
      .where('pizza.id = :id', { id })
      .andWhere('(pizza.santaId = :userId OR pizza.receiverId = :userId)', {
        userId: user.id,
      })
      .getOne();
  }

  async isUserSantaInGroup(user: User, group: Group): Promise<boolean> {
    const pizzaWithUserAsSanta = await this.createQueryBuilder('pizza')
      .where('pizza.santaId = :userId', { userId: user.id })
      .andWhere('pizza.groupId = :groupId', { groupId: group.id })
      .getOne();
    return !!pizzaWithUserAsSanta;
  }

  async isUserReceiverInGroup(user: User, group: Group): Promise<boolean> {
    const pizzaWithUserAsReceiver = await this.createQueryBuilder('pizza')
      .where('pizza.receiverId = :userId', { userId: user.id })
      .andWhere('pizza.groupId = :groupId', { groupId: group.id })
      .getOne();
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
