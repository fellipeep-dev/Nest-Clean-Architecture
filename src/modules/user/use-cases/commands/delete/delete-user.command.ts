import { DeleteCommand } from '@abstractions';

export class DeleteUserCommand extends DeleteCommand {
  constructor(public readonly id: string) {
    super();
  }
}
