import * as bcrypt from 'bcrypt';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

import { User } from '../user/user.entity';

@Entity()
@Unique(['mail'])
export class Auth extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  mail: string;

  @Column()
  password: string;

  @Column()
  salt: string;

  @OneToOne(() => User, (user) => user.auth)
  @JoinColumn()
  user: User;

  async validatePassword(password: string): Promise<boolean> {
    const hash = await bcrypt.hash(password, this.salt);
    return hash === this.password;
  }
}
