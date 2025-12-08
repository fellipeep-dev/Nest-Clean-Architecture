import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { IUserRepository } from 'src/modules/user/repositories/iuser.repository';
import { FindUserByEmailQuery } from './find-user-by-email.query';

@QueryHandler(FindUserByEmailQuery)
export class FindUserByEmailHandler implements IQueryHandler<FindUserByEmailQuery> {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(query: FindUserByEmailQuery) {
    const user = await this.userRepository.findByEmail(query.email);

    return user;
  }
}
