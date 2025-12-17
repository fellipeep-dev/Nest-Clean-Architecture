import { FindAllQuery } from '@abstractions';
import { QueryParamsDto } from '@dtos';
import { UserEntity } from '@entities';

export class FindAllUsersQuery extends FindAllQuery<UserEntity> {
  constructor(public readonly data: QueryParamsDto) {
    super();
  }
}
