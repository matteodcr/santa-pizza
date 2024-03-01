import { Injectable, NotFoundException } from '@nestjs/common';

import { PizzaDto } from './dto/pizza.dto';
import { PublicPizzaDto } from './dto/public-pizza.dto';
import { UpdatePizzaStatusDto } from './dto/update-pizza-status.dto';
import { PizzaStatus } from './pizza-status.enum';
import { Pizza } from './pizza.entity';
import { PizzaRepository } from './pizza.repository';
import { GroupRepository } from '../group/group.repository';
import { User } from '../user/user.entity';
import { UserRepository } from '../user/user.repository';

@Injectable()
export class PizzaService {
  constructor(
    private readonly pizzaRepository: PizzaRepository,
    private readonly userRepository: UserRepository,
    private readonly groupRepository: GroupRepository,
  ) {}

  async createPizza(pizzaDto: PizzaDto, user: User): Promise<PublicPizzaDto> {
    const pizza = new Pizza();
    pizza.group = await this.groupRepository.getGroupById(
      pizzaDto.groupId,
      user,
    );
    // TODO: Directly get them from one request instead of mutliplying useless requests
    pizza.santa = await this.userRepository.getUser(pizzaDto.santa);
    pizza.receiver = await this.userRepository.getUser(pizzaDto.receiver);
    if (
      await this.pizzaRepository.isUserReceiverInGroup(
        pizza.receiver,
        pizza.group,
      )
    ) {
      throw new NotFoundException(
        `${pizza.receiver.username} is already receiver in this group`,
      );
    }
    if (
      await this.pizzaRepository.isUserSantaInGroup(pizza.santa, pizza.group)
    ) {
      throw new NotFoundException(
        `${pizza.santa.username} is already santa in this group`,
      );
    }

    pizza.status = PizzaStatus.OPEN;

    await this.pizzaRepository.save(pizza);
    return new PublicPizzaDto(pizza);
  }

  async deletePizza(id: number, user: User): Promise<void> {
    const pizza = await this.pizzaRepository.getPizzaById(id, user);
    await this.pizzaRepository.remove(pizza);
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
    return pizza;
  }
}
