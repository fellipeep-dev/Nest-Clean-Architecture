import { EventBus } from '@nestjs/cqrs';
import { BaseEntity } from '../../../kernel/entities';
import { UpdateCommand } from './update.command';
import { EntityChangedEvent } from 'src/shared/events/entity-changed/entity-changed.event';
import { IValidationService } from '../../../kernel/services/ivalidation.service';
import { RepositoryFactory } from 'src/shared/infrastructure';
import { CacheEntity } from 'src/shared/events/entity-changed/entity-changed.types';

export abstract class UpdateHandler<
  TEntity extends BaseEntity,
  TCommand extends UpdateCommand<object>,
> {
  constructor(
    protected readonly repository: RepositoryFactory<TEntity>,
    protected readonly validationService: IValidationService,
    protected readonly eventBus: EventBus,
    protected readonly cacheEntity: CacheEntity,
  ) {}

  async execute(command: TCommand): Promise<void> {
    const { id, data } = command;

    await this.validationService.doesExist(id);

    await this.repository.update(id, data);

    this.eventBus.publish(
      new EntityChangedEvent({
        entity: this.cacheEntity,
        action: 'update',
        id,
      }),
    );
  }
}
