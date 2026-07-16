import { RepositoryFactory } from 'src/shared/infrastructure';
import { AuthEntity } from '../entities/auth.entity';
import { CreateAuthDto } from '../../presentation/dtos/create-auth.dto';

export abstract class IAuthRepository extends RepositoryFactory<
  AuthEntity,
  CreateAuthDto
> {
  constructor() {
    super('auth');
  }
}
