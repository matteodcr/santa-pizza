import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

import { Auth } from '../auth/auth.entity';
import { Membership } from '../membership/membership.entity';
import { Pizza } from '../pizza/pizza.entity';

@Entity()
@Unique(['username'])
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column('jsonb', { nullable: true })
  allergies: string[];

  @OneToMany(() => Membership, (membership) => membership.user)
  memberships: Membership[];

  @OneToMany(() => Pizza, (pizza) => pizza.santa)
  sentPizzas: Pizza[];

  @OneToMany(() => Pizza, (pizza) => pizza.receiver)
  receivedPizzas: Pizza[];

  @OneToOne(() => Auth, (auth) => auth.user)
  auth: Auth;
}
