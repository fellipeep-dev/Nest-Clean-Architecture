import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SingInAuthCommand } from './sing-in.auth.command';
import { IAuthRepository } from '../../../domain/repositories/iauth.repository';
import { FindUserByEmailHandler } from 'src/modules/user/use-cases/queries/find-by-email/find-user-by-email.handler';
import { FindUserByEmailQuery } from 'src/modules/user/use-cases/queries/find-by-email/find-user-by-email.query';
import { addDays } from 'date-fns';
import { compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@CommandHandler(SingInAuthCommand)
export class SingInAuthHandler implements ICommandHandler<SingInAuthCommand> {
  constructor(
    private readonly jwtService: JwtService,
    private readonly findUserByEmailHandler: FindUserByEmailHandler,
    private readonly authRepository: IAuthRepository,
  ) {}

  async execute(command: SingInAuthCommand): Promise<{ access_token: string }> {
    const { data } = command;

    const userQuery = new FindUserByEmailQuery(data.login);
    const user = await this.findUserByEmailHandler.execute(userQuery);

    if (!user) return { access_token: '' };

    const passwordIsEqual = await compare(data.password, user?.password);

    if (!passwordIsEqual) return { access_token: '' };

    const auth = await this.authRepository.create({
      userId: user.id,
      expiresAt: addDays(new Date(), 30),
    });

    const payload = { sub: auth.userId, authId: auth.id };

    return { access_token: await this.jwtService.signAsync(payload) };
  }
}
