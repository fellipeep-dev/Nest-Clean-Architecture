import { Command } from '@nestjs/cqrs';

export abstract class UpdateCommand<
  TUpdateDto extends object,
> extends Command<void> {
  id: string;
  data: TUpdateDto;
}
