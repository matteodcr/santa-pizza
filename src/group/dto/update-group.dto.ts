import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateGroupNameDto {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  name: string;
}

export class UpdateGroupDescriptionDto {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  description: string;
}

export class UpdateGroupDateDto {
  @IsOptional()
  @IsDateString()
  dueDate?: Date;
}
