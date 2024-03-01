import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Membership, Role } from '../membership/membership.entity';
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

  @OneToMany(() => Membership, (membership) => membership.group)
  memberships: Membership[];

  @OneToMany(() => Pizza, (pizza) => pizza.group)
  pizzas: Pizza[];

  isAdmin(username: string): boolean {
    return this.memberships.some(
      (membership) =>
        membership.user.username === username && membership.role === Role.ADMIN,
    );
  }
}
