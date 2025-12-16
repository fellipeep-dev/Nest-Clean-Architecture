import { IQuery } from '@nestjs/cqrs';

export interface FindByIdQuery extends IQuery {
  id: string;
}
