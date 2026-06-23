import { Query } from '@nestjs/cqrs';
import { BaseEntity } from '../../../kernel/entities';
import { QueryParamsDto } from 'src/shared-presentation/dtos';

export abstract class FindAllQuery<TEntity extends BaseEntity> extends Query<
  TEntity[]
> {
  data!: QueryParamsDto;
}
