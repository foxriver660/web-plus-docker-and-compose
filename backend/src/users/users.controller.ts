import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Request,
  UsePipes,
  ValidationPipe,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { User } from './entities/user.entity';
import { FindUsersDto } from './dto/find-users.dto';
import { ThrottlerGuard } from '@nestjs/throttler';

@UseGuards(ThrottlerGuard)
@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('find')
  create(@Body() { query }: FindUsersDto) {
    return this.usersService.findMany(query);
  }

  @Get('me')
  findMe(@Request() { user: { id } }) {
    console.log(id);
    return this.usersService.findByIdOrName(id, 'id');
  }

  @Get(':username')
  findByUserName(@Param('username') username: string) {
    return this.usersService.findByIdOrName(username, 'username');
  }

  @Patch('me')
  update(@Request() { user: { id } }, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Get('me/wishes')
  findMyWishes(@Request() { user: { username } }) {
    return this.usersService.findUserWishes(username);
  }

  @Get(':username/wishes')
  findByUserWishes(@Param('username') username: string) {
    return this.usersService.findUserWishes(username);
  }
}
