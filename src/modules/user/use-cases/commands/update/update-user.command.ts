import { UpdateCommand } from '@abstractions';
import { UpdateUserDto } from '@dtos';

export class UpdateUserCommand extends UpdateCommand<UpdateUserDto> {
  constructor(
    public readonly id: string,
    public readonly data: UpdateUserDto,
  ) {
    super();
  }
}
