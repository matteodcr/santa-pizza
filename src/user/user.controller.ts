// user.controller.ts
import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseFilePipeBuilder,
  Patch,
  Post,
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
  @Patch('/modify')
  async editUser(
    @Body() editUserDto: EditUserDto,
    @GetUser() user: User,
  ): Promise<any> {
    return this.userService.updateUser(editUserDto, user);
  }

  @ApiOperation({
    summary: 'Uploads a profile picture',
  })
  @ApiResponse({
    status: 200,
    description: 'The profile picture has been successfully uploaded',
  })
  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: 'public/profile-pictures/',
        filename: (req, file, cb) => {
          cb(null, 'pp-' + uuidv4() + '.jpg');
        },
      }),
    }),
  )
  async uploadProfilePicture(
    @GetUser() user: User,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addMaxSizeValidator({ maxSize: 10000000 })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    file: Express.Multer.File,
  ) {
    return this.userService.setAvatar(user, file.path);
  }
}
