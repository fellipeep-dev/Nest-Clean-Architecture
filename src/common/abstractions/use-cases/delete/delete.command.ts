import { ICommand } from '@nestjs/cqrs';

export interface DeleteCommand extends ICommand {
  id: string;
}
