import { CreateUserDto } from '@dtos';
import { Command } from '@nestjs/cqrs';

export class CreateUserCommand extends Command<{ actionId: string }> {
  constructor(public readonly data: CreateUserDto) {
    super();
  }
}
