import { UpdateUserDto } from '@dtos';
import { Command } from '@nestjs/cqrs';

export class UpdateUserCommand extends Command<void> {
  constructor(
    public readonly id: string,
    public readonly data: UpdateUserDto,
  ) {
    super();
  }
}
