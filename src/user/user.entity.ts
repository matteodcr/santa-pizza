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

@Entity()
@Unique(['username'])
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  avatarUrl: string;

  @Column('jsonb', { nullable: true })
  allergies: string[];

  @OneToMany(() => Membership, (membership) => membership.user)
  memberships: Membership[];

  @OneToOne(() => Auth, (auth) => auth.user) // Relation inverse OneToOne avec Auth
  auth: Auth;
}
