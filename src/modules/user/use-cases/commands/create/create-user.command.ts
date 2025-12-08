import { Command } from '@nestjs/cqrs';

export class CreateUserCommand extends Command<{ actionId: string }> {
  constructor(
    public readonly name: string,
    public readonly email: string,
    public readonly password: string,
    public readonly profilePictureUrl: string | null,
  ) {
    super();
  }
}
