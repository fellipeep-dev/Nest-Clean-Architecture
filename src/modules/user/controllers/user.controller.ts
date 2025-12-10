import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { IUserService } from '../services/iuser.service';
import { CreateUserDto, QueryParamsDto, UpdateUserDto } from '@dtos';
import { QueryConditionsPipe } from 'src/common/pipes';

@Controller('user')
export class UserController {
  constructor(private readonly userService: IUserService) {}

  @Post()
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.CreateUser(createUserDto);
  }

  @Get()
  findAllUsers(@Query(new QueryConditionsPipe()) query: QueryParamsDto) {
    return this.userService.FindAllUsers(query);
  }

  @Get('id/:id')
  findUserById(@Param('id') id: string) {
    return this.userService.FindUserById(id);
  }

  @Get('email/:email')
  findUserByEmail(@Param('email') email: string) {
    return this.userService.FindUserByEmail(email);
  }

  @Put('id/:id')
  updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.UpdateUser(id, updateUserDto);
  }

  @Delete('id/:id')
  deleteUser(@Param('id') id: string) {
    return this.userService.DeleteUser(id);
  }
}
