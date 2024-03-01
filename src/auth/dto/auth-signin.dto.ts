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
  @ExclusiveFields(['mail', 'username'])
  @IsEmail()
  @IsString()
  @IsOptional()
  mail: string;

  @MinLength(4)
  @MaxLength(20)
  @IsOptional()
  username: string;

  @IsString()
  @MinLength(8)
  @MaxLength(20)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Password too weak',
  })
  password: string;
}
