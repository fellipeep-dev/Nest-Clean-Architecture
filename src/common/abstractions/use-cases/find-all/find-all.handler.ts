import { CacheKeys, generateCacheKey, QueryBuilder } from '@utils';
import { BaseEntity } from '../../entities';
import { RepositoryFactory } from '../../repositories';
import { FindAllQuery } from './find-all.query';
import { Inject } from '@nestjs/common';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import type { CacheEntity } from 'src/domain/types';

export abstract class FindAllHandler<
  TEntity extends BaseEntity,
  TQuery extends FindAllQuery<TEntity>,
> {
  constructor(
    protected readonly repository: RepositoryFactory<TEntity>,
    @Inject(CACHE_MANAGER) protected readonly cache: Cache,
    protected readonly cacheEntity: CacheEntity,
  ) {}

  async execute(queryParams: TQuery): Promise<TEntity[]> {
    const { data } = queryParams;

    const version = await this.cache.get<number>(
      CacheKeys[this.cacheEntity].FIND_ALL_VERSION,
    );

    const cacheKey = generateCacheKey(
      CacheKeys[this.cacheEntity].FIND_ALL,
      data,
      version,
    );

    const cached = await this.cache.get<TEntity[]>(cacheKey);
    if (cached !== undefined) return cached;

    const query = new QueryBuilder(data).build();
    const entities = await this.repository.findAll(query);

    await this.cache.set(cacheKey, entities, 5000);

    return entities;
  }
}
