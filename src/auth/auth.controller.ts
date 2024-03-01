import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';

import { AuthService } from './auth.service';
import { AuthSigninDto } from './dto/auth-signin.dto';
import { AuthSignupDto } from './dto/auth-signup.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('signup')
  async signUp(
    @Body(ValidationPipe) authCredentialsDto: AuthSignupDto,
  ): Promise<void> {
    return this.authService.signUp(authCredentialsDto);
  }

  @Post('signin')
  async signIn(
    @Body(ValidationPipe) authSigninDto: AuthSigninDto,
  ): Promise<{ accessToken: string }> {
    return this.authService.signIn(authSigninDto);
  }
}
