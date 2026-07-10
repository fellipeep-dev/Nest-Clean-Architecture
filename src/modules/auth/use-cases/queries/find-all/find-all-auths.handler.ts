import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FindAllAuthsQuery } from './find-all-auths.query';
import { FindAllHandler, FindByIdHandler } from 'src/shared/abstractions';
import { AuthEntity } from 'src/modules/auth/domain/entities/auth.entity';
import { IAuthRepository } from 'src/modules/auth/domain/repositories/iauth.repository';
import { Inject } from '@nestjs/common';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { CacheEntity } from 'src/shared/events/entity-changed/entity-changed.types';

@QueryHandler(FindAllAuthsQuery)
export class FindAllAuthsHandler
  extends FindAllHandler<AuthEntity, FindAllAuthsQuery>
  implements IQueryHandler<FindAllAuthsQuery>
{
  constructor(
    protected readonly authRepository: IAuthRepository,
    @Inject(CACHE_MANAGER) protected readonly cache: Cache,
  ) {
    super(authRepository, cache, CacheEntity.AUTH);
  }
}
