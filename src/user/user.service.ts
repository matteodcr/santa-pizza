import * as fs from 'fs';

import { Injectable, Logger } from '@nestjs/common';

import { EditUserDto } from './dto/edit-user.dto';
import { User } from './user.entity';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  private logger = new Logger('UserService');

  constructor(private userRepository: UserRepository) {}

  async getUser(user: User): Promise<User> {
    return this.userRepository.getUser(user.username);
  }

  async getUserByName(username: string): Promise<User> {
    return this.userRepository.getUserByName(username);
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
    await user.save();
    this.logger.debug(`User ${user.username} updated`);

    return user;
  }
  public async setAvatar(user: User, avatarPath: string) {
    if (user.avatarUrl && fs.existsSync(user.avatarUrl)) {
      fs.unlinkSync(user.avatarUrl);
    }
    await this.userRepository.update(user.id, { avatarUrl: avatarPath });
  }
}
