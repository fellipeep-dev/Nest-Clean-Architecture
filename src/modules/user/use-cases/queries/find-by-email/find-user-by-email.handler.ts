import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { IUserRepository } from 'src/modules/user/repositories/iuser.repository';
import { FindUserByEmailQuery } from './find-user-by-email.query';
import { UserEntity } from '@entities';
import { CacheKeys } from '@utils';
import { Inject } from '@nestjs/common';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';

@QueryHandler(FindUserByEmailQuery)
export class FindUserByEmailHandler implements IQueryHandler<FindUserByEmailQuery> {
  constructor(
    private readonly userRepository: IUserRepository,
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
  ) {}

  async execute(query: FindUserByEmailQuery): Promise<UserEntity | null> {
    const cacheKey = CacheKeys.USERS.FIND_BY_EMAIL(query.email);

    const cached = await this.cache.get<UserEntity>(cacheKey);
    if (cached) return cached;

    const user = await this.userRepository.findByEmail(query.email);

    await this.cache.set(cacheKey, user, 5000);

    return user;
  }
}
