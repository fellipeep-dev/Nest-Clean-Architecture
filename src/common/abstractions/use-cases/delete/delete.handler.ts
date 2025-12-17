import { EventBus } from '@nestjs/cqrs';
import { BaseEntity } from '../../entities';
import { RepositoryFactory } from '../../repositories';
import { DeleteCommand } from './delete.command';
import { EntityChangedEvent } from 'src/common/events/entity-changed/entity-changed.event';
import { CacheEntity } from 'src/domain/types';
import { IValidationService } from '../../services/ivalidation.service';

export abstract class DeleteHandler<
  TEntity extends BaseEntity,
  TCommand extends DeleteCommand,
> {
  constructor(
    protected readonly repository: RepositoryFactory<TEntity>,
    protected readonly validationService: IValidationService,
    protected readonly eventBus: EventBus,
    protected readonly cacheEntity: CacheEntity,
  ) {}

  async execute(command: TCommand): Promise<void> {
    const { id } = command;

    await this.validationService.doesExist(id);

    await this.repository.softDelete(id);

    this.eventBus.publish(
      new EntityChangedEvent({
        entity: this.cacheEntity,
        action: 'delete',
        id,
      }),
    );
  }
}
