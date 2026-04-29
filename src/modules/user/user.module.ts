import { Module } from '@nestjs/common';
import { UserRepository } from './infrastructure/user.repository';
import { IUserRepository } from './domain/repositories/iuser.repository';
import { UserController } from './presentation/controllers/user.controller';
import { CreateUserHandler } from './use-cases/commands/create/create-user.handler';
import { FindAllUsersHandler } from './use-cases/queries/find-all/find-all-users.handler';
import { FindUserByIdHandler } from './use-cases/queries/find-by-id/find-user-by-id.handler';
import { FindUserByEmailHandler } from './use-cases/queries/find-by-email/find-user-by-email.handler';
import { UpdateUserHandler } from './use-cases/commands/update/update-user.handler';
import { DeleteUserHandler } from './use-cases/commands/delete/delete-user.handler';
import { IUserValidationService } from './use-cases/services/iuser-validation.service';
import { UserValidationService } from './use-cases/services/user-validation.service';

@Module({
  controllers: [UserController],
  providers: [
    CreateUserHandler,
    FindAllUsersHandler,
    FindUserByIdHandler,
    FindUserByEmailHandler,
    UpdateUserHandler,
    DeleteUserHandler,
    { provide: IUserRepository, useClass: UserRepository },
    { provide: IUserValidationService, useClass: UserValidationService },
  ],
})
export class UserModule {}
