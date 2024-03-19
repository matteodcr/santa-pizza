import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { GroupController } from './group.controller';
import { Group } from './group.entity';
import { GroupRepository } from './group.repository';
import { GroupService } from './group.service';
import { AuthModule } from '../auth/auth.module';
import { AuthRepository } from '../auth/auth.repository';
import { MembershipRepository } from '../membership/membership.repository';
import { PizzaRepository } from '../pizza/pizza.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Group]), AuthModule, HttpModule],
  controllers: [GroupController],
  providers: [
    GroupService,
    GroupRepository,
    AuthRepository,
    MembershipRepository,
    PizzaRepository,
  ],
  exports: [GroupService, GroupRepository],
})
export class GroupModule {}
