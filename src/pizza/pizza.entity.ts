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

  @ManyToOne(() => Group, (group) => group.pizzas, { eager: true })
  group: Group;

  @OneToOne(() => Membership, (membership) => membership.santaPizza, {
    eager: true,
  })
  @JoinColumn()
  santaMembership: Membership;

  @Column()
  santaMembershipId: number;

  @OneToOne(() => Membership, (membership) => membership.receiverPizza, {
    eager: true,
  })
  @JoinColumn()
  receiverMembership: Membership;

  @Column({ nullable: true })
  description: string;

  @Column()
  status: PizzaStatus;
}
