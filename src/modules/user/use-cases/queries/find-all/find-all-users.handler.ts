import { UserEntity } from '@entities';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { IUserRepository } from 'src/modules/user/repositories/iuser.repository';
import { FindAllUsersQuery } from './find-all-users.query';
import { Inject } from '@nestjs/common';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { FindAllHandler } from '@abstractions';

@QueryHandler(FindAllUsersQuery)
export class FindAllUsersHandler
  extends FindAllHandler<UserEntity, FindAllUsersQuery>
  implements IQueryHandler<FindAllUsersQuery>
{
  constructor(
    protected readonly userRepository: IUserRepository,
    @Inject(CACHE_MANAGER) protected readonly cache: Cache,
  ) {
    super(userRepository, cache, 'USERS');
  }
}
