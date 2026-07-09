import { RepositoryFactory } from 'src/shared/infrastructure';
import { AuthEntity } from '../entities/auth.entity';
import { SingInAuthDto } from '../../presentation/dtos/sing-in.auth.dto';

export abstract class IAuthRepository extends RepositoryFactory<
  AuthEntity,
  { userId: string; expiresAt: Date }
> {
  constructor() {
    super('auth');
  }
}
