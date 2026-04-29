import { Injectable } from '@nestjs/common';
import { IUserRepository } from '../domain/repositories/iuser.repository';
import { UserEntity } from '../domain/entities/user.entity';

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
