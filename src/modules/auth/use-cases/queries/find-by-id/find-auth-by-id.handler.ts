import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FindAuthByIdQuery } from './find-auth-by-id.query';
import { FindByIdHandler } from 'src/shared/abstractions';
import { AuthEntity } from 'src/modules/auth/domain/entities/auth.entity';
import { IAuthRepository } from 'src/modules/auth/domain/repositories/iauth.repository';
import { Inject } from '@nestjs/common';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { CacheEntity } from 'src/shared/events/entity-changed/entity-changed.types';

@QueryHandler(FindAuthByIdQuery)
export class FindAuthByIdHandler
  extends FindByIdHandler<AuthEntity, FindAuthByIdQuery>
  implements IQueryHandler<FindAuthByIdQuery>
{
  constructor(
    protected readonly authRepository: IAuthRepository,
    @Inject(CACHE_MANAGER) protected readonly cache: Cache,
  ) {
    super(authRepository, cache, CacheEntity.AUTH);
  }
}
