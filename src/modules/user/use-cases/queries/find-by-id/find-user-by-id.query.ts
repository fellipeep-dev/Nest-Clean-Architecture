import { FindByIdQuery } from 'src/common/abstractions';
import { UserEntity } from 'src/domain/entities';

export class FindUserByIdQuery extends FindByIdQuery<UserEntity> {
  constructor(public readonly id: string) {
    super();
  }
}
