import { IEvent } from '@nestjs/cqrs';

export class EntityChangedEvent implements IEvent {
  constructor(
    public readonly payload: {
      entity: string;
      action: 'create' | 'update' | 'delete';
      id?: string;
      identifiers?: Record<string, string>;
    },
  ) {}
}
