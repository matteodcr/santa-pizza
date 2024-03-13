import { Injectable, Logger, NotFoundException } from '@nestjs/common';

import { UpdatePizzaStatusDto } from './dto/update-pizza-status.dto';
import { PizzaStatus } from './pizza-status.enum';
import { Pizza } from './pizza.entity';
import { PizzaRepository } from './pizza.repository';
import { GroupRepository } from '../group/group.repository';
import { MembershipRepository } from '../membership/membership.repository';
import { User } from '../user/user.entity';
import { UserRepository } from '../user/user.repository';

@Injectable()
export class PizzaService {
  private logger = new Logger('PizzaService');
  constructor(
    private readonly pizzaRepository: PizzaRepository,
    private readonly userRepository: UserRepository,
    private readonly membershipRepository: MembershipRepository,
    private readonly groupRepository: GroupRepository,
  ) {}

  async deletePizza(id: number, user: User): Promise<void> {
    const pizza = await this.pizzaRepository.getPizzaById(id, user);
    await this.pizzaRepository.remove(pizza);
    this.logger.debug(`Deleted Pizza ${id}`);
  }

  async getPizzas(user: User): Promise<Pizza[]> {
    return this.pizzaRepository.getPizzas(user);
  }

  async getPizzaById(id: number, user: User): Promise<Pizza | undefined> {
    return this.pizzaRepository.getPizzaById(id, user);
  }

  async updatePizza(
    id: number,
    updatePizzaStatusDto: UpdatePizzaStatusDto,
    user: User,
  ): Promise<Pizza> {
    const pizza = await this.pizzaRepository.getPizzaById(id, user);
    if (!pizza) {
      throw new NotFoundException('Pizza not found');
    }
    pizza.status = PizzaStatus[updatePizzaStatusDto.status];

    await this.pizzaRepository.save(pizza);
    this.logger.debug(`Updated Pizza ${pizza.id}`);

    return pizza;
  }
}
