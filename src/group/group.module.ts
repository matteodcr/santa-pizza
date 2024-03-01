import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { GroupController } from './group.controller';
import { Group } from './group.entity';
import { GroupRepository } from './group.repository';
import { GroupService } from './group.service';
import { AuthModule } from '../auth/auth.module';
import { AuthRepository } from '../auth/auth.repository';
import { MembershipRepository } from '../membership/membership.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Group]), AuthModule],
  controllers: [GroupController],
  providers: [
    GroupService,
    GroupRepository,
    AuthRepository,
    MembershipRepository,
  ],
  exports: [GroupService, GroupRepository],
})
export class GroupModule {}
