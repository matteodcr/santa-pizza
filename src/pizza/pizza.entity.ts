import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../auth/user.entity';
import { PizzaStatus } from './pizza-status.enum';
import { Group } from '../group/group.entity';

@Entity()
export class Pizza extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Group, (group) => group.pizzas, { eager: false })
  group: string;

  @ManyToOne(() => User, (user) => user.sentPizzas, { eager: false })
  santa: string;

  @ManyToOne(() => User, (user) => user.receivedPizzas, { eager: false })
  receiver: string;

  @Column()
  status: PizzaStatus;

  // @Column()
  // userId: number;
}
