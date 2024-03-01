// user.controller.ts
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { EditUserDto } from './dto/edit-user.dto';
import { User } from './user.entity';
import { UserService } from './user.service';
import { GetUser } from '../auth/get-user-decorator';

@ApiTags('user')
@ApiBearerAuth()
@Controller('user')
@UseGuards(AuthGuard())
@UsePipes(ValidationPipe)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({
    summary: 'Gets the current user',
  })
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully retrieved',
  })
  @Get('/me')
  async getUser(@GetUser() user: User): Promise<User> {
    return this.userService.getUser(user);
  }

  @ApiOperation({
    summary: 'Gets a user by username',
  })
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully retrieved',
  })
  @Get('/:username')
  async getUserByName(@Param('username') username: string): Promise<any> {
    return this.userService.getUserByName(username);
  }

  @ApiOperation({
    summary: 'Edits the current user',
  })
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully edited',
  })
  @Patch()
  async editUser(
    @Body() editUserDto: EditUserDto,
    @GetUser() user: User,
  ): Promise<any> {
    return this.userService.updateUser(editUserDto, user);
  }
}
