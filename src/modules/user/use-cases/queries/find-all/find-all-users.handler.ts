import { UserEntity } from '@entities';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { IUserRepository } from 'src/modules/user/repositories/iuser.repository';
import { FindAllUsersQuery } from './find-all-users.query';
import { CacheKeys, generateCacheKey, QueryBuilder } from '@utils';
import { Inject } from '@nestjs/common';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';

@QueryHandler(FindAllUsersQuery)
export class FindAllUsersHandler implements IQueryHandler<FindAllUsersQuery> {
  constructor(
    private readonly userRepository: IUserRepository,
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
  ) {}

  async execute(queryParams: FindAllUsersQuery): Promise<UserEntity[]> {
    const { data } = queryParams;

    const cacheKey = generateCacheKey(CacheKeys.USERS.FIND_ALL, data);

    const cached = await this.cache.get<UserEntity[]>(cacheKey);
    if (cached) return cached;

    const query = new QueryBuilder(data).build();
    const users = await this.userRepository.findAll(query);

    await this.cache.set(cacheKey, users, 5000);

    return users;
  }
}
