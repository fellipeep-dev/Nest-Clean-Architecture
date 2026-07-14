import { UpdateCommand } from 'src/shared/abstractions';

export class SingOutAuthCommand extends UpdateCommand<{}> {
  constructor(public readonly id: string) {
    super();
  }
}
