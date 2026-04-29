import { CreateCommand } from 'src/common/abstractions';
import { CreateUserDto } from 'src/modules/user/presentation/dtos/create-user.dto';

export class CreateUserCommand extends CreateCommand<CreateUserDto> {
  constructor(public readonly data: CreateUserDto) {
    super();
  }
}
