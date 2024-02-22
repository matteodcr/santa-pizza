import {
  BaseEntity,
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../auth/user.entity';
import { Pizza } from '../pizza/pizza.entity';

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

  @ManyToMany(() => User, (user) => user.groups)
  users: User[];

  @OneToMany(() => Pizza, (pizza) => pizza.group)
  pizzas: Pizza[];
}
