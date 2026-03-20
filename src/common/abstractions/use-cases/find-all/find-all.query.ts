import { QueryParamsDto } from 'src/domain/dtos';
import { Query } from '@nestjs/cqrs';
import { BaseEntity } from '../../entities';

export abstract class FindAllQuery<TEntity extends BaseEntity> extends Query<
  TEntity[]
> {
  data: QueryParamsDto;
}
