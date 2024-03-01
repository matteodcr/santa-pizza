import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { AuthRepository } from './auth.repository';
import { AuthSigninDto } from './dto/auth-signin.dto';
import { AuthSignupDto } from './dto/auth-signup.dto';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class AuthService {
  private logger = new Logger('AuthService');
  constructor(
    private authRepository: AuthRepository,
    private jwtService: JwtService,
  ) {}
  async signUp(authSignupDto: AuthSignupDto): Promise<void> {
    return this.authRepository.signUp(authSignupDto);
  }
  async signIn(authSigninDto: AuthSigninDto): Promise<{ accessToken: string }> {
    const username =
      await this.authRepository.validateUserPassword(authSigninDto);

    if (!username) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload: JwtPayload = { username };
    const accessToken = this.jwtService.sign(payload);
    this.logger.debug(
      `Generated JWT Token with payload ${JSON.stringify(payload)}`,
    );

    return { accessToken };
  }
}
