import { DeleteCommand } from 'src/shared/abstractions';

export class DeleteUserCommand extends DeleteCommand {
  constructor(public readonly id: string) {
    super();
  }
}
