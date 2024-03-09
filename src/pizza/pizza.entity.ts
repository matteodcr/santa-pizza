import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { PizzaStatus } from './pizza-status.enum';
import { Group } from '../group/group.entity';
import { Membership } from '../membership/membership.entity';

@Entity()
export class Pizza extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Group, (group) => group.pizzas)
  group: Group;

  @OneToOne(() => Membership, (membership) => membership.santaPizza)
  @JoinColumn()
  santaMembership: Membership;

  @OneToOne(() => Membership, (membership) => membership.receiverPizza)
  @JoinColumn()
  receiverMembership: Membership;

  @Column({ nullable: true })
  description: string;

  @Column()
  status: PizzaStatus;
}
