import { RepositoryFactory } from 'src/common/abstractions';
import { UserEntity } from '../entities/user.entity';
import { CreateUserDto } from '../../presentation/dtos/create-user.dto';
import { UpdateUserDto } from '../../presentation/dtos/update-user.dto';

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
