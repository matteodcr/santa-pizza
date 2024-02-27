import { Pizza } from '../pizza.entity';
import { PublicUserDto } from '../../auth/dto/public-user.dto';

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
