import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateUserCommand } from './create-user.command';
import { IUserRepository } from 'src/modules/user/repositories/iuser.repository';
import { hash } from '@utils';
import { HttpException, HttpStatus } from '@nestjs/common';

@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(command: CreateUserCommand): Promise<{ actionId: string }> {
    const { data } = command;

    const emailAlreadyExists = await this.userRepository.findByEmail(
      data.email,
    );

    if (emailAlreadyExists)
      throw new HttpException('email already exists', HttpStatus.CONFLICT);

    const hashedPassword = await hash(data.password);

    const user = await this.userRepository.create({
      ...data,
      password: hashedPassword,
    });

    return { actionId: user.id };
  }
}
