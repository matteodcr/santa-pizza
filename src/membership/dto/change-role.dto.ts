import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

import { GroupRole } from '../membership.entity';

export class ChangeRoleDto {
  @ApiProperty({
    example: 4,
  })
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  groupId: number;

  @ApiProperty({
    example: 'Marc',
  })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    example: 'USER',
    enum: GroupRole,
  })
  @IsString()
  @IsNotEmpty()
  role: GroupRole;
}
