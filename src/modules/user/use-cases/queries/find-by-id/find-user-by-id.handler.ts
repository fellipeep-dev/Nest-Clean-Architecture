import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { IUserRepository } from 'src/modules/user/repositories/iuser.repository';
import { FindUserByIdQuery } from './find-user-by-id.query';
import { Inject } from '@nestjs/common';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { UserEntity } from '@entities';
import { FindByIdHandler } from '@abstractions';

@QueryHandler(FindUserByIdQuery)
export class FindUserByIdHandler
  extends FindByIdHandler<UserEntity, FindUserByIdQuery>
  implements IQueryHandler<FindUserByIdQuery>
{
  constructor(
    protected readonly userRepository: IUserRepository,
    @Inject(CACHE_MANAGER) protected readonly cache: Cache,
  ) {
    super(userRepository, cache, 'USERS');
  }
}
