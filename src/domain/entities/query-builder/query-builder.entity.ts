export class QueryBuilderEntity {
  skip?: number;
  take?: number;
  where?: Record<string, any>;
  orderBy?: Record<string, 'asc' | 'desc'>;
}
