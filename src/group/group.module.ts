import { Module } from '@nestjs/common';
import { GroupController } from './group.controller';
import { GroupService } from './group.service';
import { GroupRepository } from './group.repository';
import { Group } from './group.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { AuthService } from '../auth/auth.service';
import { UserRepository } from '../auth/user.repository';
import { MembershipRepository } from '../membership/membership.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Group]), AuthModule],
  controllers: [GroupController],
  providers: [
    GroupService,
    GroupRepository,
    UserRepository,
    MembershipRepository,
  ],
  exports: [GroupService, GroupRepository],
})
export class GroupModule {}
