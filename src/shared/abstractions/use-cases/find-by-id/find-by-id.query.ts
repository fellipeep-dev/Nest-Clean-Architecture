import { Query } from '@nestjs/cqrs';
import { BaseEntity } from '../../../kernel/entities';

export abstract class FindByIdQuery<
  TEntity extends BaseEntity,
> extends Query<TEntity | null> {
  id!: string;
}
