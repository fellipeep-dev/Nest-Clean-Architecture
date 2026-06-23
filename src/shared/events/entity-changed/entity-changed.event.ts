import { IEvent } from '@nestjs/cqrs';
import { CacheEntity, CrudAction } from './entity-changed.types';

export class EntityChangedEvent implements IEvent {
  constructor(
    public readonly payload: {
      entity: CacheEntity;
      action: CrudAction;
      id?: string;
      identifiers?: Record<string, string>;
    },
  ) {}
}
