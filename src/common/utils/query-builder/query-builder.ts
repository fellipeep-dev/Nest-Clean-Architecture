import { QueryBuilderEntity } from '@entities';
import { QueryParamsDto } from 'src/domain/dtos/query-builder/query-params.dto';

export class QueryBuilder {
  public query: QueryBuilderEntity;

  constructor(private params: QueryParamsDto) {
    this.query = {
      where: {
        deletedAt: null,
      },
    };
  }

  addPagination() {
    const { page, limit } = this.params;

    const skip = page ? (Number(page) - 1) * Number(limit || 10) : 1;
    const take = limit ? Number(limit) : 10;

    if (page && limit) {
      this.query.skip = skip;
      this.query.take = take;
    }

    return this;
  }

  addConditions() {
    const { conditions } = this.params;

    if (conditions) {
      this.query.where = {
        ...this.query.where,
        ...conditions,
      };
    }

    return this;
  }

  addSorting() {
    const { orderBy, sortOrder } = this.params;

    if (orderBy && sortOrder) {
      this.query.orderBy = {
        [orderBy]: sortOrder.toLowerCase() as 'asc' | 'desc',
      };
    }

    return this;
  }

  build(): QueryBuilderEntity {
    this.addPagination();
    this.addConditions();
    this.addSorting();

    return this.query;
  }
}
