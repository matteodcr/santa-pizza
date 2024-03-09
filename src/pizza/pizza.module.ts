import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PizzaController } from './pizza.controller';
import { Pizza } from './pizza.entity';
import { PizzaRepository } from './pizza.repository';
import { PizzaService } from './pizza.service';
import { AuthModule } from '../auth/auth.module';
import { GroupRepository } from '../group/group.repository';
import { MembershipRepository } from '../membership/membership.repository';
import { UserRepository } from '../user/user.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Pizza]), AuthModule],
  providers: [
    PizzaService,
    PizzaRepository,
    GroupRepository,
    UserRepository,
    MembershipRepository,
  ],
  controllers: [PizzaController],
})
export class PizzaModule {}
