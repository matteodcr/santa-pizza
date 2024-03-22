import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Pizza } from './pizza.entity';
import { PizzaRepository } from './pizza.repository';
import { AuthModule } from '../auth/auth.module';
import { GroupRepository } from '../group/group.repository';
import { MembershipRepository } from '../membership/membership.repository';
import { UserRepository } from '../user/user.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Pizza]), AuthModule],
  providers: [
    PizzaRepository,
    GroupRepository,
    UserRepository,
    MembershipRepository,
  ],
})
export class PizzaModule {}
