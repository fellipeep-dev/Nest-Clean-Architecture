import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateUserCommand } from './update-user.command';
import { IUserRepository } from 'src/modules/user/repositories/iuser.repository';
import { HttpException, HttpStatus } from '@nestjs/common';

@CommandHandler(UpdateUserCommand)
export class UpdateUserHandler implements ICommandHandler<UpdateUserCommand> {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(command: UpdateUserCommand): Promise<void> {
    const { email } = command;

    if (email) {
      const emailAlreadyExists = await this.userRepository.findByEmail(email);

      if (emailAlreadyExists)
        throw new HttpException('email already exists', HttpStatus.CONFLICT);
    }

    const user = await this.userRepository.findById(command.id);

    if (!user) throw new HttpException('user not found', HttpStatus.NOT_FOUND);

    await this.userRepository.update({
      ...command,
    });
  }
}
