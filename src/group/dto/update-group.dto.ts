import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsString } from 'class-validator';

export class UpdateGroupNameDto {
  @ApiProperty({
    example: 'New Year Party',
    required: false,
    description: 'The name of the group',
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  name: string;
}

export class UpdateGroupDescriptionDto {
  @ApiProperty({
    example: 'It will be a great party!',
    required: true,
    description: 'The description of the group',
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  description: string;
}

export class UpdateGroupDateDto {
  @ApiProperty({
    example: '2021-12-31T23:59:59Z',
    required: true,
    description: 'The date of the end of the group',
    type: Date,
  })
  @IsDateString()
  dueDate?: Date;
}
