import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class JoinRemoveGroupDto {
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
}
