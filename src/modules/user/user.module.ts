import { Module } from '@nestjs/common';
import { UserRepository } from './repositories/user.repository';
import { IUserRepository } from './repositories/iuser.repository';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';
import { CreateUserHandler } from './use-cases/commands/create/create-user.handler';
import { FindAllUsersHandler } from './use-cases/queries/find-all/find-all-users.handler';
import { FindUserByIdHandler } from './use-cases/queries/find-by-id/find-user-by-id.handler';
import { FindUserByEmailHandler } from './use-cases/queries/find-by-email/find-user-by-email.handler';
import { UpdateUserHandler } from './use-cases/commands/update/update-user.handler';
import { DeleteUserHandler } from './use-cases/commands/delete/delete-user.handler';

@Module({
  controllers: [UserController],
  providers: [
    CreateUserHandler,
    FindAllUsersHandler,
    FindUserByIdHandler,
    FindUserByEmailHandler,
    UpdateUserHandler,
    DeleteUserHandler,
    UserService,
    { provide: IUserRepository, useClass: UserRepository },
  ],
  exports: [UserService],
})
export class UserModule {}
