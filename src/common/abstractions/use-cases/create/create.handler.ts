import { RepositoryFactory } from '../../repositories';
import { BaseEntity } from '../../entities';
import { CreateCommand } from './create.command';
import { EventBus } from '@nestjs/cqrs';
import { EntityChangedEvent } from 'src/common/events/entity-changed/entity-changed.event';
import { CacheEntity } from 'src/domain/types';

export abstract class CreateHandler<
  TEntity extends BaseEntity,
  TCommand extends CreateCommand<any>,
  TRepository extends RepositoryFactory<TEntity>,
> {
  constructor(
    protected readonly repository: TRepository,
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
