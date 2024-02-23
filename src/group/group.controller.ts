import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { GroupService } from './group.service';
import { GetUser } from '../auth/get-user-decorator';
import { User } from '../auth/user.entity';
import { CreateGroupDto } from './dto/create-group.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetGroupFilterDto } from './dto/get-group-filter.dto';
import { PublicGroupDto } from './dto/public-group.dto';
import {
  UpdateGroupDateDto,
  UpdateGroupDescriptionDto,
  UpdateGroupNameDto,
} from './dto/update-group.dto';
import { JoinRemoveGroupDto } from '../membership/dto/join-remove-group.dto';

@Controller('group')
@UseGuards(AuthGuard())
@UsePipes(ValidationPipe)
export class GroupController {
  constructor(private groupService: GroupService) {}

  @Get()
  getGroups(
    @Query(ValidationPipe) filterDto: GetGroupFilterDto,
    @GetUser() user: User,
  ): Promise<PublicGroupDto[]> {
    return this.groupService.getGroups(filterDto, user);
  }

  @Get('/:id')
  getGroupById(@Param('id', ParseIntPipe) id: number, @GetUser() user: User) {
    return this.groupService.getGroupById(id, user);
  }

  @Post()
  createGroup(
    @Body() createGroupDto: CreateGroupDto,
    @GetUser() user: User,
  ): Promise<PublicGroupDto> {
    return this.groupService.createGroup(createGroupDto, user);
  }

  @Delete('/:id')
  deleteGroup(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
  ): Promise<void> {
    return this.groupService.deleteGroup(id, user);
  }

  @Patch('/:id/name')
  updateGroupName(
    @Param('id') id: number,
    @GetUser() user: User,
    @Body() updateGroupNameDto: UpdateGroupNameDto,
  ): Promise<PublicGroupDto> {
    return this.groupService.updateGroupName(id, user, updateGroupNameDto);
  }
  @Patch('/:id/description')
  updateGroupDescription(
    @Param('id') id: number,
    @GetUser() user: User,
    @Body() updateGroupDescriptionDto: UpdateGroupDescriptionDto,
  ): Promise<PublicGroupDto> {
    return this.groupService.updateGroupDescription(
      id,
      user,
      updateGroupDescriptionDto,
    );
  }

  @Patch('/:id/date')
  updateGroupDate(
    @Param('id') id: number,
    @GetUser() user: User,
    @Body() updateGroupDateDto: UpdateGroupDateDto,
  ): Promise<PublicGroupDto> {
    return this.groupService.updateGroupDate(id, user, updateGroupDateDto);
  }
}
