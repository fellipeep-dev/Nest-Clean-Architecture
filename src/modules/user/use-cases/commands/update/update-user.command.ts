import { UpdateCommand } from 'src/common/abstractions';
import { UpdateUserDto } from 'src/domain/dtos';

export class UpdateUserCommand extends UpdateCommand<UpdateUserDto> {
  constructor(
    public readonly id: string,
    public readonly data: UpdateUserDto,
  ) {
    super();
  }
}
