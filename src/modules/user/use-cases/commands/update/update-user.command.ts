import { Command } from '@nestjs/cqrs';

export class UpdateUserCommand extends Command<void> {
  constructor(
    public readonly id: string,
    public readonly name: string | null,
    public readonly email: string | null,
    public readonly profilePictureUrl: string | null,
  ) {
    super();
  }
}
