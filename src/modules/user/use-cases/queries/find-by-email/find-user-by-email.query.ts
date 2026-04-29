import { Query } from '@nestjs/cqrs';
import { UserEntity } from 'src/modules/user/domain/entities/user.entity';

export class FindUserByEmailQuery extends Query<UserEntity | null> {
  constructor(public readonly email: string) {
    super();
  }
}
