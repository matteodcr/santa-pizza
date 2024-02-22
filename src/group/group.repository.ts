import { DataSource, Repository } from 'typeorm';
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Group } from './group.entity';
import { GetGroupFilterDto } from './dto/get-group-filter.dto';
import { User } from '../auth/user.entity';
import { CreateGroupDto } from './dto/create-group.dto';
import { PublicGroupDto } from './dto/public-group.dto';

@Injectable()
export class GroupRepository extends Repository<Group> {
  constructor(private dataSource: DataSource) {
    super(Group, dataSource.createEntityManager());
  }

  async getGroups(
    filterDto: GetGroupFilterDto,
    user: User,
  ): Promise<PublicGroupDto[]> {
    const { search } = filterDto;

    let query = this.createQueryBuilder('group')
      .innerJoinAndSelect('group.users', 'user')
      .where('user.id = :userId', { userId: user.id });

    if (search) {
      query = query.andWhere(
        'group.name LIKE :searchQuery OR group.description LIKE :searchQuery',
        { searchQuery: `%${search}%` },
      );
    }

    try {
      const response = await query.getMany();
      return response.map((group: Group) => new PublicGroupDto(group));
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async getGroupById(id: number, user: User): Promise<PublicGroupDto> {
    const group = await this.findOne({
      where: { id: id },
      relations: ['users'],
    });

    if (!group) {
      throw new NotFoundException(`Group with ID ${id} not found`);
    }

    const userInGroup = group.users.find((u) => u.id === user.id);
    if (!userInGroup) {
      throw new UnauthorizedException(`User is not a member of this group`);
    }

    console.log(new PublicGroupDto(group));

    return new PublicGroupDto(group);
  }

  async deleteGroup(id: number, user: User) {
    const group = await this.findOne({
      where: { id: id },
      relations: ['users'],
    });

    console.log(group);

    if (!group || !group.users.some((u) => u.id === user.id)) {
      throw new NotFoundException(`Group with ID ${id} not found`);
    }

    await this.remove(group);
  }

  // async signUp(authCredentialsDto: AuthCredentialsDto) {
  //   const { username, password } = authCredentialsDto;
  //
  //   const user = new User();
  //   user.username = username;
  //   user.salt = await bcrypt.genSalt();
  //   user.password = await this.hashPassword(password, user.salt);
  //
  //   try {
  //     await user.save();
  //   } catch (error) {
  //     // duplicate username
  //     if (error.code === '23505') {
  //       throw new ConflictException('Username already exists');
  //     } else {
  //       throw new InternalServerErrorException();
  //     }
  //   }
  // }
  //
  // async validateUserPassword(
  //   authCredentialsDto: AuthCredentialsDto,
  // ): Promise<string> {
  //   const { username, password } = authCredentialsDto;
  //   const user = await this.findOneBy({ username });
  //
  //   if (user && (await user.validatePassword(password))) {
  //     return user.username;
  //   } else {
  //     return null;
  //   }
  // }
  //
  // private async hashPassword(password: string, salt: string): Promise<string> {
  //   return bcrypt.hash(password, salt);
  // }
}
