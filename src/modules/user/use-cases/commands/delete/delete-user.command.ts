import { DeleteCommand } from 'src/common/abstractions';

export class DeleteUserCommand extends DeleteCommand {
  constructor(public readonly id: string) {
    super();
  }
}
