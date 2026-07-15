import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { SingInAuthCommand } from './sing-in.auth.command';
import { IAuthRepository } from '../../../domain/repositories/iauth.repository';
import { FindUserByEmailHandler } from 'src/modules/user/use-cases/queries/find-by-email/find-user-by-email.handler';
import { FindUserByEmailQuery } from 'src/modules/user/use-cases/queries/find-by-email/find-user-by-email.query';
import { addDays } from 'date-fns';
import { compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { EntityChangedEvent } from 'src/shared/events/entity-changed/entity-changed.event';
import { CacheEntity } from 'src/shared/events/entity-changed/entity-changed.types';
import { UnauthorizedException } from '@nestjs/common';
import { expiresAt } from 'src/modules/auth/domain/consts/expires-at';

@CommandHandler(SingInAuthCommand)
export class SingInAuthHandler implements ICommandHandler<SingInAuthCommand> {
  constructor(
    private readonly jwtService: JwtService,
    private readonly findUserByEmailHandler: FindUserByEmailHandler,
    private readonly eventBus: EventBus,
    private readonly authRepository: IAuthRepository,
  ) {}

  async execute(command: SingInAuthCommand): Promise<{ access_token: string }> {
    const { data } = command;

    const userQuery = new FindUserByEmailQuery(data.login);
    const user = await this.findUserByEmailHandler.execute(userQuery);

    if (!user)
      throw new UnauthorizedException({
        errorCode: 'INVALID_CREDENTIALS',
        message: 'Invalid credentials',
      });

    const passwordIsEqual = await compare(data.password, user?.password);

    if (!passwordIsEqual)
      throw new UnauthorizedException({
        errorCode: 'INVALID_CREDENTIALS',
        message: 'Invalid credentials',
      });

    const auth = await this.authRepository.create({
      userId: user.id,
      expiresAt: addDays(new Date(), expiresAt),
    });

    const payload = { sub: auth.userId, authId: auth.id };

    this.eventBus.publish(
      new EntityChangedEvent({
        entity: CacheEntity.AUTH,
        action: 'create',
      }),
    );

    return { access_token: await this.jwtService.signAsync(payload) };
  }
}
