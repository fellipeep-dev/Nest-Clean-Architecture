import { AuthEntity } from 'src/modules/auth/domain/entities/auth.entity';
import { QueryParamsDto } from 'src/shared-presentation/dtos';
import { FindAllQuery } from 'src/shared/abstractions';

export class FindAllAuthsQuery extends FindAllQuery<AuthEntity> {
  constructor(public readonly data: QueryParamsDto) {
    super();
  }
}
