import { PublicUserDto } from '../../user/dto/public-user.dto';
import { Pizza } from '../pizza.entity';

export class PublicPizzaDto {
  id: number;

  groupId: number;

  santa: PublicUserDto;

  receiver: PublicUserDto;

  status: string;

  constructor(pizza: Pizza) {
    this.id = pizza.id;
    this.groupId = pizza.group.id;
    this.santa = new PublicUserDto(pizza.santa);
    this.receiver = new PublicUserDto(pizza.receiver);
    this.status = pizza.status;
  }
}
