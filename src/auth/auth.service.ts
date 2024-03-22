import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { Auth } from './auth.entity';
import { AuthRepository } from './auth.repository';
import { AuthSigninDto } from './dto/auth-signin.dto';
import { AuthSignupDto } from './dto/auth-signup.dto';
import { JwtPayload } from './jwt-payload.interface';
import { User } from '../user/user.entity';
import { generateRandomName } from '../utils/UsernameGenerator';

@Injectable()
export class AuthService {
  private logger = new Logger('AuthService');
  constructor(
    private authRepository: AuthRepository,
    private jwtService: JwtService,
  ) {}
  async signUp(authSignupDto: AuthSignupDto) {
    const { mail, username, password } = authSignupDto;

    try {
      await this.authRepository.manager.transaction(
        async (transactionalEntityManager) => {
          const user = new User();
          user.username = username;
          user.name = generateRandomName();
          await transactionalEntityManager.save(user);

          const auth = new Auth();
          auth.mail = mail;
          auth.salt = await bcrypt.genSalt();
          auth.password = await this.authRepository.hashPassword(
            password,
            auth.salt,
          );
          auth.user = user;
          await transactionalEntityManager.save(auth);
        },
      );
    } catch (error) {
      // duplicate username
      if (error.code === '23505') {
        this.logger.debug('Username already exists');
        throw new ConflictException('Username already exists');
      } else {
        this.logger.error(
          `Failed to create user ${username}: ${error.message}`,
        );
        throw new InternalServerErrorException();
      }
    }
  }
  async signIn(authSigninDto: AuthSigninDto): Promise<{ accessToken: string }> {
    const username =
      await this.authRepository.validateUserPassword(authSigninDto);

    if (!username) {
      this.logger.debug(`Invalid credentials for ${authSigninDto.username}`);
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload: JwtPayload = { username };
    const accessToken = this.jwtService.sign(payload);
    this.logger.verbose(
      `Generated JWT Token with payload ${JSON.stringify(payload)}`,
    );

    return { accessToken };
  }
}
