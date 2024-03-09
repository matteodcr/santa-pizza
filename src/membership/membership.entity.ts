// membership.entity.ts
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Group } from '../group/group.entity';
import { Pizza } from '../pizza/pizza.entity';
import { User } from '../user/user.entity';

export enum GroupRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

@Entity()
export class Membership extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.memberships)
  user: User;

  @ManyToOne(() => Group, (group) => group.memberships)
  group: Group;

  @Column()
  userId: number;

  @OneToOne(() => Pizza, (pizza) => pizza.santaMembership)
  santaPizza: Pizza;

  @OneToOne(() => Pizza, (pizza) => pizza.receiverMembership)
  receiverPizza: Pizza;

  @Column()
  groupId: number;

  @Column({ default: GroupRole.USER })
  role: GroupRole;
}
