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
import {
  UpdateGroupDateDto,
  UpdateGroupDescriptionDto,
  UpdateGroupNameDto,
} from './dto/update-group.dto';
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
    return this.groupService.getGroups(filterDto, user);
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
  @Patch('/:id/name')
  updateGroupName(
    @Param('id') id: number,
    @GetUser() user: User,
    @Body() updateGroupNameDto: UpdateGroupNameDto,
  ): Promise<PublicGroupDto> {
    return this.groupService.updateGroupName(id, user, updateGroupNameDto);
  }

  @ApiOperation({
    summary: 'Update a group description by its id',
  })
  @ApiResponse({
    status: 201,
    description: 'The group description has been successfully updated.',
    type: PublicGroupDto,
  })
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

  @ApiOperation({
    summary: 'Update a group date by its id',
  })
  @ApiResponse({
    status: 201,
    description: 'The group dueDate has been successfully updated.',
    type: PublicGroupDto,
  })
  @Patch('/:id/date')
  updateGroupDate(
    @Param('id') id: number,
    @GetUser() user: User,
    @Body() updateGroupDateDto: UpdateGroupDateDto,
  ): Promise<PublicGroupDto> {
    return this.groupService.updateGroupDate(id, user, updateGroupDateDto);
  }

  @ApiOperation({
    summary: 'Update a group date by its id',
  })
  @ApiResponse({
    status: 201,
    description: 'The group dueDate has been successfully updated.',
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
