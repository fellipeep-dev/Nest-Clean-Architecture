import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { IUserService } from '../services/iuser.service';
import { CreateUserDto, UpdateUserDto } from '@dtos';

@Controller('user')
export class UserController {
  constructor(private readonly userService: IUserService) {}

  @Post()
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.CreateUser(createUserDto);
  }

  @Get()
  findAllUsers() {
    return this.userService.FindAllUsers();
  }

  @Get('id/:id')
  findUserById(@Param('id') id: string) {
    return this.userService.FindUserById(id);
  }

  @Get('email/:email')
  findUserByEmail(@Param('email') email: string) {
    return this.userService.FindUserByEmail(email);
  }

  @Put(':id')
  updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.UpdateUser(id, updateUserDto);
  }

  @Delete(':id')
  deleteUser(@Param('id') id: string) {
    return this.userService.DeleteUser(id);
  }
}
