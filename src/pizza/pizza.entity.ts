import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { PizzaStatus } from './pizza-status.enum';
import { Group } from '../group/group.entity';
import { User } from '../user/user.entity';

@Entity()
export class Pizza extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Group, (group) => group.pizzas)
  group: Group;

  @ManyToOne(() => User, (user) => user.sentPizzas)
  santa: User;

  @ManyToOne(() => User, (user) => user.receivedPizzas)
  receiver: User;

  @Column()
  status: PizzaStatus;
}
