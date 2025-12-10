import { UserEntity } from '@entities';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { IUserRepository } from 'src/modules/user/repositories/iuser.repository';
import { FindAllUsersQuery } from './find-all-users.query';
import { QueryBuilder } from '@utils';

@QueryHandler(FindAllUsersQuery)
export class FindAllUsersHandler implements IQueryHandler<FindAllUsersQuery> {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(queryParams: FindAllUsersQuery): Promise<UserEntity[]> {
    const { data } = queryParams;

    const query = new QueryBuilder(data).build();

    const users = await this.userRepository.findAll(query);

    return users;
  }
}
