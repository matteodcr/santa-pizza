import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Pizza } from '../pizza/pizza.entity';
import { Membership, Role } from '../membership/membership.entity';

@Entity()
export class Group extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
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
