import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString } from 'class-validator';

import { IsDifferent } from '../../pizza/pipes/is-different.pipe';

export class EditUserDto {
  @ApiProperty({
    example: 'Marc Roudier',
    required: true,
    type: String,
  })
  @IsOptional()
  @IsString()
  name: string;

  @ApiProperty({
    example: '19yo student from Paris',
    required: true,
    description: 'The description of the user',
    type: String,
  })
  @IsOptional()
  @IsString()
  @IsDifferent('receiver', { message: 'Santa must be different from receiver' })
  description: string;

  @ApiProperty({
    example: ['gluten', 'lactose'],
    required: true,
    description: 'The list of allergies of the user',
    type: String,
    isArray: true,
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  allergies: string[];
}
