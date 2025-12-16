import { ICommand } from '@nestjs/cqrs';

export interface CreateCommand<TCreateDto> extends ICommand {
  data: TCreateDto;
}
