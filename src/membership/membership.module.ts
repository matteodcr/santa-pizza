import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MembershipController } from './membership.controller';
import { Membership } from './membership.entity';
import { MembershipRepository } from './membership.repository';
import { MembershipService } from './membership.service';
import { AuthModule } from '../auth/auth.module';
import { GroupRepository } from '../group/group.repository';
import { UserRepository } from '../user/user.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Membership]), AuthModule],
  providers: [
    MembershipService,
    MembershipRepository,
    GroupRepository,
    UserRepository,
  ],
  controllers: [MembershipController],
})
export class MembershipModule {}
