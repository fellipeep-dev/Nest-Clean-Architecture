import { Command } from '@nestjs/cqrs';

export abstract class DeleteCommand extends Command<void> {
  id: string;
}
