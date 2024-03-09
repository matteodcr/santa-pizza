import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { GroupStatus } from './group-status.enum';
import { GroupRole, Membership } from '../membership/membership.entity';
import { Pizza } from '../pizza/pizza.entity';

@Entity()
export class Group extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  dueDate: Date;

  @Column()
  status: GroupStatus;

  @OneToMany(() => Membership, (membership) => membership.group)
  memberships: Membership[];

  @OneToMany(() => Pizza, (pizza) => pizza.group)
  pizzas: Pizza[];

  isAdmin(username: string): boolean {
    return this.memberships.some(
      (membership) =>
        membership.user.username === username &&
        membership.role === GroupRole.ADMIN,
    );
  }
}
