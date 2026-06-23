import { EventBus } from '@nestjs/cqrs';
import { BaseEntity } from '../../../kernel/entities';
import { DeleteCommand } from './delete.command';
import { EntityChangedEvent } from 'src/shared/events/entity-changed/entity-changed.event';
import { IValidationService } from '../../../kernel/services/ivalidation.service';
import { RepositoryFactory } from 'src/shared/infrastructure';
import { CacheEntity } from 'src/shared/events/entity-changed/entity-changed.types';

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
