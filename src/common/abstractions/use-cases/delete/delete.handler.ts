import { EventBus } from '@nestjs/cqrs';
import { BaseEntity } from '../../entities';
import { RepositoryFactory } from '../../repositories';
import { DeleteCommand } from './delete.command';
import { EntityChangedEvent } from 'src/common/events/entity-changed/entity-changed.event';
import { CacheEntity } from 'src/domain/types';

export abstract class DeleteHandler<
  TEntity extends BaseEntity,
  TCommand extends DeleteCommand,
  TRepository extends RepositoryFactory<TEntity>,
> {
  constructor(
    protected readonly repository: TRepository,
    protected readonly eventBus: EventBus,
    protected readonly cacheEntity: CacheEntity,
    protected readonly identifiers?: Record<string, any>,
  ) {}

  async execute(command: TCommand): Promise<void> {
    const { id } = command;

    await this.repository.softDelete(id);

    this.eventBus.publish(
      new EntityChangedEvent({
        entity: this.cacheEntity,
        action: 'delete',
        id,
        identifiers: this.identifiers,
      }),
    );
  }
}
