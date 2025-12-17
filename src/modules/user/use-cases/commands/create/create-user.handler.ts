import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { CreateUserCommand } from './create-user.command';
import { IUserRepository } from 'src/modules/user/repositories/iuser.repository';
import { hash } from '@utils';
import { IUserValidationService } from 'src/modules/user/services/iuser-validation.service';
import { EntityChangedEvent } from 'src/common/events/entity-changed/entity-changed.event';

@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly eventBus: EventBus,
    private readonly userValidationService: IUserValidationService,
  ) {}

  async execute(command: CreateUserCommand): Promise<{ actionId: string }> {
    const { data } = command;

    await this.userValidationService.isEmailUnique(data.email);

    const hashedPassword = await hash(data.password);

    const user = await this.userRepository.create({
      ...data,
      password: hashedPassword,
    });

    this.eventBus.publish(
      new EntityChangedEvent({
        entity: 'USERS',
        action: 'create',
      }),
    );

    return { actionId: user.id };
  }
}
