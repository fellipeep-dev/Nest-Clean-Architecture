import { Module } from '@nestjs/common';
import { EntityCacheInvalidationHandler } from './entity-changed/entity-changed.handler';

@Module({
  providers: [EntityCacheInvalidationHandler],
})
export class EventModule {}
