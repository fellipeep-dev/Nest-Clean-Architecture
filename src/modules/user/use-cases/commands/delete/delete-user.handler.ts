import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { DeleteUserCommand } from './delete-user.command';
import { IUserRepository } from 'src/modules/user/repositories/iuser.repository';
import { IUserValidationService } from 'src/modules/user/services/iuser-validation.service';
import { EntityChangedEvent } from 'src/common/events/entity-changed/entity-changed.event';

@CommandHandler(DeleteUserCommand)
export class DeleteUserHandler implements ICommandHandler<DeleteUserCommand> {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly userValidationService: IUserValidationService,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: DeleteUserCommand): Promise<void> {
    const { id } = command;

    await this.userValidationService.doesExist(id);

    const user = await this.userRepository.softDelete(id);

    this.eventBus.publish(
      new EntityChangedEvent({
        entity: 'USERS',
        action: 'delete',
        id,
        identifiers: {
          email: user.email,
        },
      }),
    );
  }
}
