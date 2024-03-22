import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { PizzaStatus } from './pizza-status.enum';
import { Pizza } from './pizza.entity';
import { User } from '../user/user.entity';

@Injectable()
export class PizzaRepository extends Repository<Pizza> {
  constructor(private dataSource: DataSource) {
    super(Pizza, dataSource.createEntityManager());
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
}
