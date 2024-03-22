import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { User } from './user.entity';

@Injectable()
export class UserRepository extends Repository<User> {
  private logger = new Logger('UserRepository');
  constructor(private dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }
  async getUser(username: string): Promise<User> {
    let user: User;
    try {
      user = await this.findOneBy({ username });
    } catch (e) {
      this.logger.error(`Failed to get user ${username}. Data: ${e.stack}`);
      throw new InternalServerErrorException();
    }
    if (!user) {
      this.logger.debug(`User ${username} not found`);
      throw new NotFoundException(`User ${username} not found`);
    }
    return user;
  }
}
