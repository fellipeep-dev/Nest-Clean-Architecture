import { CreateUserDto, UpdateUserDto } from '@dtos';
import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateUserCommand } from '../use-cases/commands/create/create-user.command';
import { FindAllUsersQuery } from '../use-cases/queries/find-all/find-all-users.query';
import { FindUserByIdQuery } from '../use-cases/queries/find-by-id/find-user-by-id.query';
import { DeleteUserCommand } from '../use-cases/commands/delete/delete-user.command';
import { UpdateUserCommand } from '../use-cases/commands/update/update-user.command';
import { FindUserByEmailQuery } from '../use-cases/queries/find-by-email/find-user-by-email.query';

@Injectable()
export class UserService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  async CreateUser(createUserDto: CreateUserDto) {
    return this.commandBus.execute(
      new CreateUserCommand(
        createUserDto.name,
        createUserDto.email,
        createUserDto.password,
        createUserDto.profilePictureUrl,
      ),
    );
  }

  async FindAllUsers() {
    return this.queryBus.execute(new FindAllUsersQuery());
  }

  async FindUserById(id: string) {
    return this.queryBus.execute(new FindUserByIdQuery(id));
  }

  async FindUserByEmail(email: string) {
    return this.queryBus.execute(new FindUserByEmailQuery(email));
  }

  async UpdateUser(id: string, updateUserDto: UpdateUserDto) {
    return this.commandBus.execute(
      new UpdateUserCommand(
        id,
        updateUserDto.name,
        updateUserDto.email,
        updateUserDto.profilePictureUrl,
      ),
    );
  }

  async DeleteUser(id: string) {
    return this.commandBus.execute(new DeleteUserCommand(id));
  }
}
