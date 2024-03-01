// user.service.ts
import { Injectable } from '@nestjs/common';

import { EditUserDto } from './dto/edit-user.dto';
import { User } from './user.entity';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}

  async getUser(user: User): Promise<User> {
    return this.userRepository.getUser(user.username);
  }

  async getUserByName(username: string): Promise<User> {
    return this.userRepository.getUserByName(username);
  }

  async updateUser(editUserDto: EditUserDto, user: User): Promise<User> {
    if (editUserDto.name) {
      user.username = editUserDto.name;
    }
    if (editUserDto.description) {
      user.description = editUserDto.description;
    }
    if (editUserDto.allergies) {
      user.allergies = editUserDto.allergies;
    }
    await user.save();
    return user;
  }
}
