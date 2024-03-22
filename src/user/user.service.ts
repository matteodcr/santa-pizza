import * as fs from 'fs';

import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';

import { EditUserDto } from './dto/edit-user.dto';
import { User } from './user.entity';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  private logger = new Logger('UserService');

  constructor(private userRepository: UserRepository) {}

  async getUser(username: string): Promise<User> {
    const retrievedUser = await this.userRepository.getUser(username);
    this.logger.verbose(`Got user ${username}`);
    return retrievedUser;
  }

  async updateUser(editUserDto: EditUserDto, user: User): Promise<User> {
    if (editUserDto.name) {
      user.name = editUserDto.name;
    }
    if (editUserDto.description) {
      user.description = editUserDto.description;
    }
    if (editUserDto.allergies) {
      user.allergies = editUserDto.allergies;
    }
    try {
      await user.save();
    } catch (e) {
      this.logger.error(
        `Failed to update user ${user.username}. Data: ${e.stack}`,
      );
      throw new InternalServerErrorException();
    }
    this.logger.verbose(`User ${user.username} updated`);

    return user;
  }
  public async setAvatar(user: User, avatarPath: string) {
    if (user.avatarUrl && fs.existsSync(user.avatarUrl)) {
      fs.unlinkSync(user.avatarUrl);
    }
    try {
      await this.userRepository.update(user.id, { avatarUrl: avatarPath });
    } catch (e) {
      this.logger.error(
        `Failed to update user ${user.username} avatar. Data: ${e.stack}`,
      );
      throw new InternalServerErrorException();
    }
    this.logger.verbose(`User ${user.username} avatar updated`);
  }
}
