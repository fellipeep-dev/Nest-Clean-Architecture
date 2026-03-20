import { CreateCommand } from 'src/common/abstractions';
import { CreateUserDto } from 'src/domain/dtos';

export class CreateUserCommand extends CreateCommand<CreateUserDto> {
  constructor(public readonly data: CreateUserDto) {
    super();
  }
}
