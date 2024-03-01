// membership.entity.ts
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Group } from '../group/group.entity';
import { User } from '../user/user.entity';

export enum Role {
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

  @Column()
  groupId: number;

  @Column({ default: Role.USER })
  role: Role;
}
