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
import { Group } from './group.entity';
import { CreateGroupDto } from './dto/create-group.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetGroupFilterDto } from './dto/get-group-filter.dto';
import { PublicGroupDto } from './dto/public-group.dto';

@Controller('group')
@UseGuards(AuthGuard())
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
  @UsePipes(ValidationPipe)
  createGroup(
    @Body() createGroupDto: CreateGroupDto,
    @GetUser() user: User,
  ): Promise<PublicGroupDto> {
    console.log('ok');
    return this.groupService.createGroup(createGroupDto, user);
  }

  @Delete('/:id')
  deleteGroup(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
  ): Promise<void> {
    console.log(id);
    return this.groupService.deleteGroup(id, user);
  }

  // @Patch('/:id/status')
  // updateGroupName(
  //   @Param('id') id: number,
  //   @Body('name') name: string,
  //   @GetUser() user: User,
  // ): Promise<Group> {
  //   return this.groupService.updateGroupName(id, user);
  // }
}
