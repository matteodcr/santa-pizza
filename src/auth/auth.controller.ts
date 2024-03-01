import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { AuthSigninDto } from './dto/auth-signin.dto';
import { AuthSignupDto } from './dto/auth-signup.dto';
import { TokenDto } from './dto/token.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @ApiOperation({
    summary: 'Signups a new user',
  })
  @ApiResponse({
    status: 201,
    description: 'The user has been successfully created',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid request',
  })
  @Post('signup')
  async signUp(
    @Body(ValidationPipe) authCredentialsDto: AuthSignupDto,
  ): Promise<void> {
    return this.authService.signUp(authCredentialsDto);
  }

  @ApiOperation({
    summary: 'Signs in a user and returns an access token',
  })
  @ApiResponse({
    status: 201,
    description: 'The access token has been successfully created',
    type: TokenDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid request',
  })
  @ApiResponse({
    status: 401,
    description: 'The credentials are invalid',
  })
  @Post('signin')
  async signIn(
    @Body(ValidationPipe) authSigninDto: AuthSigninDto,
  ): Promise<TokenDto> {
    return this.authService.signIn(authSigninDto);
  }
}
