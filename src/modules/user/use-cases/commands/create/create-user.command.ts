import { CreateCommand } from '@abstractions';
import { CreateUserDto } from '@dtos';

export class CreateUserCommand extends CreateCommand<CreateUserDto> {
  constructor(public readonly data: CreateUserDto) {
    super();
  }
}
