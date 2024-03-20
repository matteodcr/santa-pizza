import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class GetGroupFilterDto {
  @ApiProperty({
    description:
      'The search string to filter the groups by name or description',
    example: 'New Year Party',
  })
  @IsOptional()
  @IsNotEmpty()
  search?: string;
}
