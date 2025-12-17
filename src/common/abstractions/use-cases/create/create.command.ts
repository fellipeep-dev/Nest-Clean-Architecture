import { Command } from '@nestjs/cqrs';

export abstract class CreateCommand<TCreateDto extends object> extends Command<{
  actionId: string;
}> {
  data: TCreateDto;
}
