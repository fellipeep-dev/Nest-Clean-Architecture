import { EventBus } from '@nestjs/cqrs';
import { BaseEntity } from '../../entities';
import { RepositoryFactory } from '../../repositories';
import { UpdateCommand } from './update.command';
import { EntityChangedEvent } from 'src/common/events/entity-changed/entity-changed.event';
import { CacheEntity } from 'src/domain/types';

export abstract class UpdateHandler<
  TEntity extends BaseEntity,
  TCommand extends UpdateCommand<any>,
  TRepository extends RepositoryFactory<TEntity>,
> {
  constructor(
    protected readonly repository: TRepository,
    protected readonly eventBus: EventBus,
    protected readonly cacheEntity: CacheEntity,
    protected readonly identifiers?: Record<string, any>,
  ) {}

  async execute(command: TCommand): Promise<void> {
    const { id, data } = command;

    await this.repository.update(id, data);

    this.eventBus.publish(
      new EntityChangedEvent({
        entity: this.cacheEntity,
        action: 'update',
        id,
        identifiers: this.identifiers,
      }),
    );
  }
}
