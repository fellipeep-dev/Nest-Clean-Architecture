import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { IUserRepository } from 'src/modules/user/repositories/iuser.repository';
import { FindUserByIdQuery } from './find-user-by-id.query';
import { CacheKeys } from '@utils';
import { Inject } from '@nestjs/common';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { UserEntity } from '@entities';

@QueryHandler(FindUserByIdQuery)
export class FindUserByIdHandler implements IQueryHandler<FindUserByIdQuery> {
  constructor(
    private readonly userRepository: IUserRepository,
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
  ) {}

  async execute(query: FindUserByIdQuery): Promise<UserEntity | null> {
    const cacheKey = CacheKeys.USERS.FIND_BY_ID(query.id);

    const cached = await this.cache.get<UserEntity>(cacheKey);
    if (cached) return cached;

    const user = await this.userRepository.findById(query.id);

    await this.cache.set(cacheKey, user, 5000);

    return user;
  }
}
