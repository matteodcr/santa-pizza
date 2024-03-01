import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { Auth } from './auth.entity';
import { AuthRepository } from './auth.repository';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authRepository: AuthRepository) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'topScret51',
    });
  }

  async validate(payload: JwtPayload): Promise<Auth> {
    const { username } = payload;
    const user = await this.authRepository.getByUsername(username);

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
