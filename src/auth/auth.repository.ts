import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { DataSource, Repository } from 'typeorm';

import { Auth } from './auth.entity';
import { AuthSigninDto } from './dto/auth-signin.dto';
import { AuthSignupDto } from './dto/auth-signup.dto';
import { User } from '../user/user.entity';

@Injectable()
export class AuthRepository extends Repository<Auth> {
  constructor(private dataSource: DataSource) {
    super(Auth, dataSource.createEntityManager());
  }

  async signUp(authSignupDto: AuthSignupDto) {
    const { mail, username, password } = authSignupDto;

    try {
      await this.manager.transaction(async (transactionalEntityManager) => {
        const user = new User();
        user.username = username;
        await transactionalEntityManager.save(user);

        const auth = new Auth();
        auth.mail = mail;
        auth.salt = await bcrypt.genSalt();
        auth.password = await this.hashPassword(password, auth.salt);
        auth.user = user;
        await transactionalEntityManager.save(auth);
      });
    } catch (error) {
      // duplicate username
      if (error.code === '23505') {
        throw new ConflictException('Username already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async getByUsername(username: string): Promise<Auth | undefined> {
    try {
      return await this.createQueryBuilder('auth')
        .leftJoinAndSelect('auth.user', 'user')
        .where('user.username = :username', { username })
        .getOne();
    } catch (error) {
      throw new Error(`Invalid username`);
    }
  }

  async getByMail(mail: string): Promise<Auth | undefined> {
    try {
      return await this.createQueryBuilder('auth')
        .leftJoinAndSelect('auth.user', 'user')
        .where('auth.mail = :mail', { mail })
        .getOne();
    } catch (error) {
      console.error(error);
      throw new Error(`Invalid mail`);
    }
  }

  async validateUserPassword(authSigninDto: AuthSigninDto): Promise<string> {
    const { mail, username, password } = authSigninDto;

    try {
      let auth: Auth;
      if (mail) {
        auth = await this.getByMail(mail);
      } else {
        auth = await this.getByUsername(username);
      }

      if (await auth.validatePassword(password)) {
        return auth.user.username;
      }
    } catch (error) {
      throw new UnauthorizedException('Invalid credentials');
    }
  }

  private async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }
}
