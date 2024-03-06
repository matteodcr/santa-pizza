import { ApiProperty } from '@nestjs/swagger';

import { User } from '../user.entity';

export class PublicUserDto {
  @ApiProperty({
    example: 3,
  })
  id: number;

  @ApiProperty({
    example: 'marcrd',
    type: String,
  })
  username: string;

  @ApiProperty({
    example: 'Marc',
    type: String,
  })
  name: string;

  @ApiProperty({
    example: 'I am the best user ever!',
    type: String,
  })
  description: string;

  @ApiProperty({
    example: ['gluten', 'lactose'],
    type: String,
    isArray: true,
  })
  allergies: string[];

  constructor(user: User) {
    this.id = user.id;
    this.username = user.username;
    this.description = user.description;
    this.name = user.name;
    this.allergies = user.allergies;
  }
}
