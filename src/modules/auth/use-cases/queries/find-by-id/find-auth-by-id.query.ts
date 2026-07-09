import { AuthEntity } from 'src/modules/auth/domain/entities/auth.entity';
import { FindByIdQuery } from 'src/shared/abstractions';

export class FindAuthByIdQuery extends FindByIdQuery<AuthEntity> {
  constructor(public readonly id: string) {
    super();
  }
}
