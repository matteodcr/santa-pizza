import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class AuthSignupDto {
  @ApiProperty({
    description: 'The email used to register your new account',
    example: 'example@example.com',
  })
  @IsEmail()
  mail: string;

  @ApiProperty({
    description: 'The username that you will use  to access your new account',
    example: 'Marc',
  })
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  username: string;

  @ApiProperty({
    description: 'The password that you will use to access to your  account',
    example: '*******',
  })
  @IsString()
  @MinLength(8)
  @MaxLength(20)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Password too weak',
  })
  password: string;
}
