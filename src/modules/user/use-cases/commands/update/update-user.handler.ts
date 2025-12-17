import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { UpdateUserCommand } from './update-user.command';
import { IUserRepository } from 'src/modules/user/repositories/iuser.repository';
import { IUserValidationService } from 'src/modules/user/services/iuser-validation.service';
import { EntityChangedEvent } from 'src/common/events/entity-changed/entity-changed.event';

@CommandHandler(UpdateUserCommand)
export class UpdateUserHandler implements ICommandHandler<UpdateUserCommand> {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly userValidationService: IUserValidationService,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: UpdateUserCommand): Promise<void> {
    const { id, data } = command;

    await this.userValidationService.doesExist(id);

    if (data.email) await this.userValidationService.isEmailUnique(data.email);

    const user = await this.userRepository.update(id, data);

    this.eventBus.publish(
      new EntityChangedEvent({
        entity: 'USERS',
        action: 'update',
        id,
        identifiers: {
          email: user.email,
        },
      }),
    );
  }
}
