import { RepositoryFactory } from 'src/shared/infrastructure';
import { BaseEntity } from '../../../kernel/entities';
import { CreateCommand } from './create.command';
import { EventBus } from '@nestjs/cqrs';
import { EntityChangedEvent } from 'src/shared/events/entity-changed/entity-changed.event';
import { CacheEntity } from 'src/shared/events/entity-changed/entity-changed.types';

export abstract class CreateHandler<
  TEntity extends BaseEntity,
  TCommand extends CreateCommand<object>,
> {
  constructor(
    protected readonly repository: RepositoryFactory<TEntity>,
    protected readonly eventBus: EventBus,
    protected readonly cacheEntity: CacheEntity,
  ) {}

  async execute(command: TCommand): Promise<{ actionId: string }> {
    const { data } = command;

    const entity = await this.repository.create(data);

    this.eventBus.publish(
      new EntityChangedEvent({
        entity: this.cacheEntity,
        action: 'create',
      }),
    );

    return { actionId: entity.id };
  }
}
