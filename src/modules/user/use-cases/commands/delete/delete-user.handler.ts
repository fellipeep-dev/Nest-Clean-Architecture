import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteUserCommand } from './delete-user.command';
import { IUserRepository } from 'src/modules/user/repositories/iuser.repository';

@CommandHandler(DeleteUserCommand)
export class DeleteUserHandler implements ICommandHandler<DeleteUserCommand> {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(command: DeleteUserCommand) {
    await this.userRepository.softDelete(command.id);
  }
}
