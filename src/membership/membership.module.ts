import { Module } from '@nestjs/common';
import { MembershipService } from './membership.service';
import { MembershipController } from './membership.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Membership } from './membership.entity';
import { AuthModule } from '../auth/auth.module';
import { GroupRepository } from '../group/group.repository';
import { UserRepository } from '../auth/user.repository';
import { MembershipRepository } from './membership.repository';

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
