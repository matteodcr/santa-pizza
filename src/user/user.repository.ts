import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { User } from './user.entity';

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(private dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }
  async getUser(username: string): Promise<User> {
    let user: User;
    try {
      user = await this.findOneBy({ username });
    } catch (e) {
      throw new InternalServerErrorException();
    }
    return user;
  }

  async getUserByName(username: string): Promise<User> {
    let user: User;
    try {
      user = await this.findOne({
        where: { username },
      });
    } catch (e) {
      throw new InternalServerErrorException();
    }
    if (!user) {
      throw new NotFoundException(`User ${username} not found`);
    }
    return user;
  }
}
