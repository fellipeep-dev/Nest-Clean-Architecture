import { FindByIdQuery } from 'src/common/abstractions';
import { UserEntity } from 'src/modules/user/domain/entities/user.entity';

export class FindUserByIdQuery extends FindByIdQuery<UserEntity> {
  constructor(public readonly id: string) {
    super();
  }
}
