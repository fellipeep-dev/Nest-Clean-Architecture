import { CreateUserDto, UpdateUserDto } from '@dtos';
import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateUserCommand } from '../use-cases/commands/create/create-user.command';
import { FindAllUsersQuery } from '../use-cases/queries/find-all/find-all-users.query';
import { FindUserByIdQuery } from '../use-cases/queries/find-by-id/find-user-by-id.query';
import { DeleteUserCommand } from '../use-cases/commands/delete/delete-user.command';
import { UpdateUserCommand } from '../use-cases/commands/update/update-user.command';
import { FindUserByEmailQuery } from '../use-cases/queries/find-by-email/find-user-by-email.query';
import { IUserService } from './iuser.service';
import { UserEntity } from '@entities';

@Injectable()
export class UserService implements IUserService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  async CreateUser(
    createUserDto: CreateUserDto,
  ): Promise<{ actionId: string }> {
    return this.commandBus.execute(new CreateUserCommand(createUserDto));
  }

  async FindAllUsers(): Promise<UserEntity[]> {
    return this.queryBus.execute(new FindAllUsersQuery());
  }

  async FindUserById(id: string): Promise<UserEntity | null> {
    return this.queryBus.execute(new FindUserByIdQuery(id));
  }

  async FindUserByEmail(email: string): Promise<UserEntity | null> {
    return this.queryBus.execute(new FindUserByEmailQuery(email));
  }

  async UpdateUser(id: string, updateUserDto: UpdateUserDto): Promise<void> {
    return this.commandBus.execute(new UpdateUserCommand(id, updateUserDto));
  }

  async DeleteUser(id: string): Promise<void> {
    return this.commandBus.execute(new DeleteUserCommand(id));
  }
}
