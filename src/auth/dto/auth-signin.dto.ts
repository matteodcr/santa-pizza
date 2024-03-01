import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

import { ExclusiveFields } from '../pipes/username-mail.pipe';

export class AuthSigninDto {
  @ApiProperty({
    description: 'The email linked to your account',
    example: 'example@example.com',
  })
  @ExclusiveFields(['mail', 'username'])
  @IsEmail()
  @IsString()
  @IsOptional()
  mail: string;

  @ApiProperty({
    description:
      'The username that you use to access your new account. ' +
      'You can use this field xor the mail field to sign in.',
    example: 'Marc',
  })
  @MinLength(4)
  @MaxLength(20)
  @IsOptional()
  username: string;

  @ApiProperty({
    description: 'The password that you use to access to your account',
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
