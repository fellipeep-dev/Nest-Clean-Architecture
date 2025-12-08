import { UserEntity } from '@entities';
import { Query } from '@nestjs/cqrs';

export class FindUserByEmailQuery extends Query<UserEntity | null> {
  constructor(public readonly email: string) {
    super();
  }
}
