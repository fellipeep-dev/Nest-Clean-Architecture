import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteUserCommand } from './delete-user.command';
import { IUserRepository } from 'src/modules/user/repositories/iuser.repository';
import { Inject } from '@nestjs/common';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { CacheKeys } from '@utils';

@CommandHandler(DeleteUserCommand)
export class DeleteUserHandler implements ICommandHandler<DeleteUserCommand> {
  constructor(
    private readonly userRepository: IUserRepository,
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
  ) {}

  async execute(command: DeleteUserCommand): Promise<void> {
    const { id } = command;

    const user = await this.userRepository.softDelete(id);

    await this.cache.del(CacheKeys.USERS.FIND_ALL);
    await this.cache.del(CacheKeys.USERS.FIND_BY_ID(id));
    await this.cache.del(CacheKeys.USERS.FIND_BY_EMAIL(user.email));
  }
}
