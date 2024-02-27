import { Module } from '@nestjs/common';
import { PizzaService } from './pizza.service';
import { PizzaController } from './pizza.controller';
import { PizzaRepository } from './pizza.repository';
import { AuthModule } from '../auth/auth.module';
import { UserRepository } from '../auth/user.repository';
import { GroupRepository } from '../group/group.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pizza } from './pizza.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Pizza]), AuthModule],
  providers: [PizzaService, PizzaRepository, UserRepository, GroupRepository],
  controllers: [PizzaController],
})
export class PizzaModule {}
