import { FindAllQuery } from 'src/common/abstractions';
import { QueryParamsDto } from 'src/domain/dtos';
import { UserEntity } from 'src/domain/entities';

export class FindAllUsersQuery extends FindAllQuery<UserEntity> {
  constructor(public readonly data: QueryParamsDto) {
    super();
  }
}
