import { QueryParamsDto } from '@dtos';
import { IQuery } from '@nestjs/cqrs';

export interface FindAllQuery extends IQuery {
  data: QueryParamsDto;
}
