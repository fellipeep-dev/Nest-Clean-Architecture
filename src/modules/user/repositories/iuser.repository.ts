import { RepositoryFactory } from '@abstractions';
import { CreateUserDto, UpdateUserDto } from '@dtos';
import { UserEntity } from '@entities';

export abstract class IUserRepository extends RepositoryFactory<
  UserEntity,
  CreateUserDto,
  UpdateUserDto
> {
  constructor() {
    super('user');
  }

  abstract findByEmail(email: string): Promise<UserEntity | null>;
}
