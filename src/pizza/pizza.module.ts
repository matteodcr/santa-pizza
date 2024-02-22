import { Module } from '@nestjs/common';
import { PizzaService } from './pizza.service';
import { PizzaController } from './pizza.controller';

@Module({
  providers: [PizzaService],
  controllers: [PizzaController]
})
export class PizzaModule {}
