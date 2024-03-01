import {
  IsEmail,
  IsString,
  Matches,
  MaxLength,
  MinLength,
  ValidateIf,
} from 'class-validator';

export class AuthSigninDto {
  @IsEmail()
  @ValidateIf((obj) => !obj.username)
  @IsString()
  mail: string;

  @MinLength(4)
  @MaxLength(20)
  @ValidateIf((obj) => !obj.mail)
  username: string;

  @IsString()
  @MinLength(8)
  @MaxLength(20)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Password too weak',
  })
  password: string;
}
