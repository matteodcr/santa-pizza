import { ApiProperty } from '@nestjs/swagger';

import { User } from '../user.entity';

export class PublicUserDto {
  @ApiProperty({
    example: 3,
  })
  id: number;

  @ApiProperty({
    example: 'Marc',
    type: String,
  })
  username: string;

  constructor(user: User) {
    this.id = user.id;
    this.username = user.username;
  }
}
