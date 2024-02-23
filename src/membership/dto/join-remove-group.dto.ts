import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class JoinRemoveGroupDto {
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  groupId: number;

  @IsString()
  @IsNotEmpty()
  username: string;
}
