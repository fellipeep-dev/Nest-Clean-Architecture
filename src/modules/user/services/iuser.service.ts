import { CreateUserDto, QueryParamsDto, UpdateUserDto } from '@dtos';
import { UserEntity } from '@entities';

export abstract class IUserService {
  abstract CreateUser(
    createUserDto: CreateUserDto,
  ): Promise<{ actionId: string }>;
  abstract FindAllUsers(query: QueryParamsDto): Promise<UserEntity[]>;
  abstract FindUserById(id: string): Promise<UserEntity | null>;
  abstract FindUserByEmail(email: string): Promise<UserEntity | null>;
  abstract UpdateUser(id: string, updateUserDto: UpdateUserDto): Promise<void>;
  abstract DeleteUser(id: string): Promise<void>;
}
