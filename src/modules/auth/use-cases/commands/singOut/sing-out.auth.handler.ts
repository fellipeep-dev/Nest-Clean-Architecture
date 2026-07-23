import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { SingOutAuthCommand } from './sing-out.auth.command';
import { IAuthRepository } from '../../../domain/repositories/iauth.repository';
import { EntityChangedEvent } from 'src/shared/events/entity-changed/entity-changed.event';
import { CacheEntity } from 'src/shared/events/entity-changed/entity-changed.types';
import { IAuthValidationService } from '../../services/iauth-validation.service';

@CommandHandler(SingOutAuthCommand)
export class SingOutAuthHandler implements ICommandHandler<SingOutAuthCommand> {
  constructor(
    private readonly authRepository: IAuthRepository,
    private readonly authValidationService: IAuthValidationService,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: SingOutAuthCommand): Promise<void> {
    const { id } = command;

    await this.authValidationService.doesExist(id);

    await this.authRepository.update(id, {
      expiresAt: new Date(),
    });

    this.eventBus.publish(
      new EntityChangedEvent({
        entity: CacheEntity.AUTH,
        action: 'update',
        id,
      }),
    );
  }
}
