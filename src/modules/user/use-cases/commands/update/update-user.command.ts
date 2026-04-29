import { UpdateCommand } from 'src/common/abstractions';
import { UpdateUserDto } from 'src/modules/user/presentation/dtos/update-user.dto';

export class UpdateUserCommand extends UpdateCommand<UpdateUserDto> {
  constructor(
    public readonly id: string,
    public readonly data: UpdateUserDto,
  ) {
    super();
  }
}
