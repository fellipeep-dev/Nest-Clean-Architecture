import { Command } from '@nestjs/cqrs';

export abstract class CreateCommand<
  TCreateDto extends object,
  TResponse = {
    actionId: string;
  },
> extends Command<TResponse> {
  data!: TCreateDto;
}
