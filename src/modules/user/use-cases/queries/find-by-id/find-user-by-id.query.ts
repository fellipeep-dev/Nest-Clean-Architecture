import { UserEntity } from '@entities';
import { Query } from '@nestjs/cqrs';

export class FindUserByIdQuery extends Query<UserEntity | null> {
  constructor(public readonly id: string) {
    super();
  }
}
