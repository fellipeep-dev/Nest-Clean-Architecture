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
import { QueryParamsDto } from 'src/domain/dtos';
import { QueryConditionsPipe } from 'src/common/pipes';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateUserCommand } from '../../use-cases/commands/create/create-user.command';
import { FindAllUsersQuery } from '../../use-cases/queries/find-all/find-all-users.query';
import { FindUserByIdQuery } from '../../use-cases/queries/find-by-id/find-user-by-id.query';
import { FindUserByEmailQuery } from '../../use-cases/queries/find-by-email/find-user-by-email.query';
import { UpdateUserCommand } from '../../use-cases/commands/update/update-user.command';
import { DeleteUserCommand } from '../../use-cases/commands/delete/delete-user.command';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UpdateUserDto } from '../dtos/update-user.dto';

@Controller('user')
export class UserController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.commandBus.execute(new CreateUserCommand(createUserDto));
  }

  @Get()
  findAllUsers(@Query(new QueryConditionsPipe()) query: QueryParamsDto) {
    return this.queryBus.execute(new FindAllUsersQuery(query));
  }

  @Get('id/:id')
  findUserById(@Param('id') id: string) {
    return this.queryBus.execute(new FindUserByIdQuery(id));
  }

  @Get('email/:email')
  findUserByEmail(@Param('email') email: string) {
    return this.queryBus.execute(new FindUserByEmailQuery(email));
  }

  @Put('id/:id')
  updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.commandBus.execute(new UpdateUserCommand(id, updateUserDto));
  }

  @Delete('id/:id')
  deleteUser(@Param('id') id: string) {
    return this.commandBus.execute(new DeleteUserCommand(id));
  }
}
