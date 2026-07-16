import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { SingInAuthCommand } from './sing-in.auth.command';
import { IAuthRepository } from '../../../domain/repositories/iauth.repository';
import { addDays } from 'date-fns';
import { compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { EntityChangedEvent } from 'src/shared/events/entity-changed/entity-changed.event';
import { CacheEntity } from 'src/shared/events/entity-changed/entity-changed.types';
import { Inject, UnauthorizedException } from '@nestjs/common';
import { expiresAt } from 'src/modules/auth/domain/consts/expires-at';
import { IUserRepository } from 'src/modules/user/domain/repositories/iuser.repository';

@CommandHandler(SingInAuthCommand)
export class SingInAuthHandler implements ICommandHandler<SingInAuthCommand> {
  constructor(
    @Inject(IUserRepository)
    private readonly userRepository: IUserRepository,
    private readonly authRepository: IAuthRepository,
    private readonly jwtService: JwtService,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: SingInAuthCommand): Promise<{ access_token: string }> {
    const { data } = command;

    const user = await this.userRepository.findByEmail(data.login);

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
