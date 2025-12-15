import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { EntityChangedEvent } from './entity-changed.event';
import { Inject } from '@nestjs/common';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { CacheKeys } from '@utils';

@EventsHandler(EntityChangedEvent)
export class EntityCacheInvalidationHandler implements IEventHandler<EntityChangedEvent> {
  constructor(@Inject(CACHE_MANAGER) private readonly cache: Cache) {}

  async handle(event: EntityChangedEvent) {
    const { entity, id, identifiers } = event.payload;

    const config = CacheKeys[entity];
    if (!config) return;

    await this.cache.set(config.FIND_ALL_VERSION, Date.now());

    if (id && config.FIND_BY_ID) await this.cache.del(config.FIND_BY_ID(id));

    if (identifiers && config.FIND_BY_IDENTIFIER) {
      for (const [key, value] of Object.entries(identifiers)) {
        await this.cache.del(config.FIND_BY_IDENTIFIER(key, value));
      }
    }
  }
}
