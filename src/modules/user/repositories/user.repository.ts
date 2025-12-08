import { Injectable } from '@nestjs/common';
import { IUserRepository } from './iuser.repository';
import { UserEntity } from '@entities';

@Injectable()
export class UserRepository extends IUserRepository {
  findByEmail(email: string): Promise<UserEntity | null> {
    return this.prismaService.user.findFirst({
      where: {
        email,
        deletedAt: null,
      },
    });
  }
}
