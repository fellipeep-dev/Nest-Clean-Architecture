import { FindAllQuery } from 'src/shared/abstractions';
import { UserEntity } from 'src/modules/user/domain/entities/user.entity';
import { QueryParamsDto } from 'src/shared-presentation/dtos';

export class FindAllUsersQuery extends FindAllQuery<UserEntity> {
  constructor(public readonly data: QueryParamsDto) {
    super();
  }
}
