import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { MembershipService } from './membership.service';
import { GetUser } from '../auth/get-user-decorator';
import { User } from '../auth/user.entity';
import { JoinRemoveGroupDto } from './dto/join-remove-group.dto';

@Controller('membership')
@UseGuards(AuthGuard())
export class MembershipController {
  constructor(private membershipService: MembershipService) {}

  @Post('/add')
  addUserToGroup(
    @GetUser() user: User,
    @Body() joinGroupDto: JoinRemoveGroupDto,
  ) {
    return this.membershipService.addUserToGroup(user, joinGroupDto);
  }

  @Post('/remove')
  removeUserFromGroup(
    @GetUser() user: User,
    @Body() joinGroupDto: JoinRemoveGroupDto,
  ) {
    return this.membershipService.removeUserFromGroup(user, joinGroupDto);
  }
}
