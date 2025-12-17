import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { BaseEntity } from '../../entities';
import { RepositoryFactory } from '../../repositories';
import { FindByIdQuery } from './find-by-id.query';
import { Inject } from '@nestjs/common';
import type { CacheEntity } from 'src/domain/types';
import { CacheKeys } from '@utils';

export abstract class FindByIdHandler<
  TEntity extends BaseEntity,
  TQuery extends FindByIdQuery<TEntity>,
> {
  constructor(
    protected readonly repository: RepositoryFactory<TEntity>,
    @Inject(CACHE_MANAGER) protected readonly cache: Cache,
    protected readonly cacheEntity: CacheEntity,
  ) {}

  async execute(query: TQuery): Promise<TEntity | null> {
    const cachekey = CacheKeys[this.cacheEntity].FIND_BY_ID(query.id);

    const cached = await this.cache.get<TEntity>(cachekey);
    if (cached !== undefined) return cached;

    const entity = await this.repository.findById(query.id);

    await this.cache.set(cachekey, entity, 5000);

    return entity;
  }
}
