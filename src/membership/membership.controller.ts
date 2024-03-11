import {
  Body,
  Controller,
  Delete,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { ChangeRoleDto } from './dto/change-role.dto';
import { JoinRemoveGroupDto } from './dto/join-remove-group.dto';
import { PublicMembershipDto } from './dto/public-membership.dto';
import { MembershipService } from './membership.service';
import { GetUser } from '../auth/get-user-decorator';
import { User } from '../user/user.entity';

@ApiTags('membership')
@ApiBearerAuth()
@Controller('membership')
@UseGuards(AuthGuard())
export class MembershipController {
  constructor(private membershipService: MembershipService) {}

  @ApiOperation({
    summary: 'Add an user to a group',
  })
  @ApiResponse({
    status: 201,
    description: 'The user has been successfully added to the group',
    type: PublicMembershipDto,
  })
  @Post('/add')
  addUserToGroup(
    @GetUser() user: User,
    @Body() joinGroupDto: JoinRemoveGroupDto,
  ) {
    return this.membershipService.addUserToGroup(user, joinGroupDto);
  }

  @ApiOperation({
    summary: 'Remove an user from a group',
  })
  @ApiResponse({
    status: 201,
    description: 'The user has been successfully removed from the group',
  })
  @Delete('/remove')
  removeUserFromGroup(
    @GetUser() user: User,
    @Body() joinGroupDto: JoinRemoveGroupDto,
  ) {
    return this.membershipService.removeUserFromGroup(user, joinGroupDto);
  }

  @ApiOperation({
    summary: 'Change the role of an user in a group',
  })
  @ApiResponse({
    status: 201,
    description: 'The role of the user has been successfully changed',
  })
  @Patch('/update')
  async changeRole(
    @GetUser() user: User,
    @Body() changeRoleDto: ChangeRoleDto,
  ): Promise<PublicMembershipDto> {
    return await this.membershipService.changeRole(user, changeRoleDto);
  }
}
