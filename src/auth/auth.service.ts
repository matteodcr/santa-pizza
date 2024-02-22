import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class AuthService {
  private logger = new Logger('AuthService');
  constructor(
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}
  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    return this.userRepository.signUp(authCredentialsDto);
  }
  async signIn(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    const username =
      await this.userRepository.validateUserPassword(authCredentialsDto);

    if (!username) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload: JwtPayload = { username };
    const accessToken = await this.jwtService.sign(payload);
    this.logger.debug(
      `Generated JWT Token with payload ${JSON.stringify(payload)}`,
    );

    return { accessToken };
  }
}
