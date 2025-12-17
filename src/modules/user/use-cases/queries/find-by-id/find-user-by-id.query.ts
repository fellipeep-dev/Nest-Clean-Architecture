import { FindByIdQuery } from '@abstractions';
import { UserEntity } from '@entities';

export class FindUserByIdQuery extends FindByIdQuery<UserEntity> {
  constructor(public readonly id: string) {
    super();
  }
}
