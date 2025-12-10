import { QueryParamsDto } from '@dtos';
import { UserEntity } from '@entities';
import { Query } from '@nestjs/cqrs';

export class FindAllUsersQuery extends Query<UserEntity[]> {
  constructor(public readonly data: QueryParamsDto) {
    super();
  }
}
