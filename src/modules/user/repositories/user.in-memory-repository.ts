import { CreateUserDto, UpdateUserDto } from 'src/domain/dtos';
import { UserEntity } from 'src/domain/entities';
import { IUserRepository } from './iuser.repository';

export class UserInMemoryRepository extends IUserRepository {
  public users: UserEntity[] = [];

  async create(createDto: CreateUserDto): Promise<UserEntity> {
    const user: UserEntity = {
      id: 'string',
      ...createDto,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    };

    this.users.push(user);

    return user;
  }

  async createMany(createDtos: CreateUserDto[]): Promise<UserEntity[]> {
    const createdUsers = createDtos.map((createdUser) => {
      const user: UserEntity = {
        id: 'string',
        ...createdUser,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      this.users.push(user);

      return user;
    });

    return createdUsers;
  }

  async findAll(): Promise<UserEntity[]> {
    return this.users;
  }

  async findManyWithIds(ids: string[]): Promise<UserEntity[]> {
    return this.users.filter((user) => ids.includes(user.id));
  }

  async findById(id: string): Promise<UserEntity | null> {
    return this.users.find((user) => user.id === id) ?? null;
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    return this.users.find((user) => user.email === email) ?? null;
  }

  async update(id: string, updateDto: UpdateUserDto): Promise<UserEntity> {
    const user = this.users.find((user) => user.id === id);

    if (!user) throw new Error('User not found');

    Object.assign(user, updateDto);
    user.updatedAt = new Date();

    return user;
  }

  async softDelete(id: string): Promise<UserEntity> {
    const user = this.users.find((user) => user.id === id);

    if (!user) throw new Error('User not found');

    user.updatedAt = new Date();
    user.deletedAt = new Date();

    return user;
  }

  async delete(id: string): Promise<UserEntity> {
    const user = this.users.find((user) => user.id === id);

    if (!user) throw new Error('User not found');

    this.users = this.users.filter((user) => user.id !== id);

    return user;
  }
}
