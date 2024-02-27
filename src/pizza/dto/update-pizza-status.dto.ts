import { IsEnum } from 'class-validator';

export class UpdatePizzaStatusDto {
  @IsEnum(['OPEN', 'COMPLETED', 'ASSOCIATED'])
  status: string;
}
