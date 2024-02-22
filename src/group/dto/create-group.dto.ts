import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { Group } from '../group.entity';

export class CreateGroupDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsOptional()
  @IsDateString()
  dueDate?: Date;
}
