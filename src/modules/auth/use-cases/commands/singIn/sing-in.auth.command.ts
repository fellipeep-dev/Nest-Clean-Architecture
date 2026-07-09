import { CreateCommand } from 'src/shared/abstractions';
import { SingInAuthDto } from '../../../presentation/dtos/sing-in.auth.dto';

export class SingInAuthCommand extends CreateCommand<
  SingInAuthDto,
  { access_token: string }
> {
  constructor(public readonly data: SingInAuthDto) {
    super();
  }
}
