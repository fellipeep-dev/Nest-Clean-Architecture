import { RepositoryFactory } from 'src/common/abstractions';
import { CreateUserDto, UpdateUserDto } from 'src/domain/dtos';
import { UserEntity } from 'src/domain/entities';

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
