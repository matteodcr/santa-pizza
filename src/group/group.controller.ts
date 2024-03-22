import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseFilePipeBuilder,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';

import { CreateGroupDto } from './dto/create-group.dto';
import { GetGroupFilterDto } from './dto/get-group-filter.dto';
import { PublicGroupDto } from './dto/public-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { Group } from './group.entity';
import { GroupService } from './group.service';
import { GetUser } from '../auth/get-user-decorator';
import { User } from '../user/user.entity';

@ApiTags('group')
@ApiBearerAuth()
@Controller('group')
@UseGuards(AuthGuard())
@UsePipes(ValidationPipe)
export class GroupController {
  constructor(private groupService: GroupService) {}

  @ApiOperation({
    summary: 'Get all groups the user is in',
  })
  @ApiResponse({
    status: 201,
    description: 'Returns all groups the user is in',
    type: PublicGroupDto,
    isArray: true,
  })
  @Get()
  async getGroups(
    @Query(ValidationPipe) filterDto: GetGroupFilterDto,
    @GetUser() user: User,
  ): Promise<PublicGroupDto[]> {
    return (await this.groupService.getGroups(filterDto, user)).map(
      (group: Group) => new PublicGroupDto(group),
    );
  }

  @ApiOperation({
    summary: 'Get a group by its id',
  })
  @ApiResponse({
    status: 201,
    description: 'Returns a group id',
    type: PublicGroupDto,
  })
  @Get('/:id')
  getGroupById(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
  ): Promise<PublicGroupDto> {
    return this.groupService.getGroupById(id, user);
  }

  @ApiOperation({
    summary: 'Create a new group',
  })
  @ApiResponse({
    status: 201,
    description: 'The group has been successfully created.',
    type: PublicGroupDto,
  })
  @Post()
  createGroup(
    @Body() createGroupDto: CreateGroupDto,
    @GetUser() user: User,
  ): Promise<PublicGroupDto> {
    return this.groupService.createGroup(createGroupDto, user);
  }

  @ApiResponse({
    description: 'The group has been successfully deleted.',
  })
  @ApiOperation({
    summary: 'Delete a group by its id',
  })
  @Delete('/:id')
  deleteGroup(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
  ): Promise<void> {
    return this.groupService.deleteGroup(id, user);
  }

  @ApiOperation({
    summary: 'Update a group name by its id',
  })
  @ApiResponse({
    status: 201,
    description: 'The group name has been successfully updated.',
    type: PublicGroupDto,
  })
  @Patch('/:id')
  updateGroupName(
    @Param('id') id: number,
    @GetUser() user: User,
    @Body() updateGroupDto: UpdateGroupDto,
  ): Promise<PublicGroupDto> {
    return this.groupService.updateGroup(id, user, updateGroupDto);
  }

  @ApiOperation({
    summary: 'Associate all pizzas in the group.',
  })
  @ApiResponse({
    status: 201,
    description: 'The pizzas have been successfully associated.',
    type: PublicGroupDto,
  })
  @Patch('/:id/associate')
  associatePizzas(
    @Param('id') id: number,
    @GetUser() user: User,
  ): Promise<void> {
    return this.groupService.associatePizzasByUser(id, user);
  }

  @ApiOperation({
    summary: 'Close a group by its id',
  })
  @ApiResponse({
    status: 201,
    description: 'The group has been successfully closed.',
    type: PublicGroupDto,
  })
  @Patch('/:id/close')
  closeGroup(@Param('id') id: number, @GetUser() user: User): Promise<void> {
    return this.groupService.closeGroup(id, user);
  }

  @ApiOperation({
    summary: 'Uploads a group picture',
  })
  @ApiResponse({
    status: 200,
    description: 'The group picture has been successfully uploaded',
  })
  @Post('/:id/upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: 'public/group-pictures/',
        filename: (req, file, cb) => {
          cb(null, 'gp-' + uuidv4() + '.jpg');
        },
      }),
    }),
  )
  async uploadProfilePicture(
    @GetUser() user: User,
    @Param('id') id: number,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addMaxSizeValidator({ maxSize: 10000000 })
        .addFileTypeValidator({ fileType: 'image/jpeg' })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    file: Express.Multer.File,
  ) {
    return this.groupService.setBackground(user, id, file.path);
  }
}
