import {
  BaseEntity,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Group } from '../group/group.entity';
import { Pizza } from '../pizza/pizza.entity';
import { PublicUserDto } from './dto/public-user.dto';
import { Membership } from '../membership/membership.entity';

@Entity()
@Unique(['username'])
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column()
  salt: string;

  @Column('jsonb', { nullable: true })
  allergies: string[];

  @ManyToMany(() => Group, (group) => group.memberships, { eager: true })
  @JoinTable()
  groups: Group[];

  @OneToMany(() => Membership, (membership) => membership.user)
  memberships: Membership[];

  @OneToMany(() => Pizza, (pizza) => pizza.santa)
  sentPizzas: Pizza[];

  @OneToMany(() => Pizza, (pizza) => pizza.receiver)
  receivedPizzas: Pizza[];

  async validatePassword(password: string): Promise<boolean> {
    const hash = await bcrypt.hash(password, this.salt);
    return hash === this.password;
  }

  format(): PublicUserDto {
    return { id: this.id, username: this.username };
  }
}
