import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateUserCommand } from './create-user.command';
import { IUserRepository } from 'src/modules/user/repositories/iuser.repository';
import { hash, CacheKeys } from '@utils';
import { Inject } from '@nestjs/common';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { IUserValidationService } from 'src/modules/user/services/iuser-validation.service';

@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly userValidationService: IUserValidationService,
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
  ) {}

  async execute(command: CreateUserCommand): Promise<{ actionId: string }> {
    const { data } = command;

    await this.userValidationService.isEmailUnique(data.email);

    const hashedPassword = await hash(data.password);

    const user = await this.userRepository.create({
      ...data,
      password: hashedPassword,
    });

    await this.cache.del(CacheKeys.USERS.FIND_ALL);

    return { actionId: user.id };
  }
}
