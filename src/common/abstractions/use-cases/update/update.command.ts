import { ICommand } from '@nestjs/cqrs';

export interface UpdateCommand<TUpdateDto> extends ICommand {
  id: string;
  data: TUpdateDto;
}
