import { AuthEntity } from '../domain/entities/auth.entity';
import { IAuthRepository } from '../domain/repositories/iauth.repository';
import { CreateAuthDto } from '../presentation/dtos/create-auth.dto';

export class AuthInMemoryRepository extends IAuthRepository {
  public auths: AuthEntity[] = [];

  async create(createDto: CreateAuthDto): Promise<AuthEntity> {
    const auth: AuthEntity = {
      id: 'string',
      ...createDto,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    };

    this.auths.push(auth);

    return auth;
  }

  async createMany(createDtos: CreateAuthDto[]): Promise<AuthEntity[]> {
    const createdAuths = createDtos.map((createdAuth) => {
      const auth: AuthEntity = {
        id: 'string',
        ...createdAuth,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      this.auths.push(auth);

      return auth;
    });

    return createdAuths;
  }

  async findAll(): Promise<AuthEntity[]> {
    return this.auths;
  }

  async findManyWithIds(ids: string[]): Promise<AuthEntity[]> {
    return this.auths.filter((auth) => ids.includes(auth.id));
  }

  async findById(id: string): Promise<AuthEntity | null> {
    return this.auths.find((auth) => auth.id === id) ?? null;
  }

  async update(
    id: string,
    updateDto: { expiresAt: Date },
  ): Promise<AuthEntity> {
    const auth = this.auths.find((auth) => auth.id === id);

    if (!auth) throw new Error('Auth not found');

    Object.assign(auth, updateDto);
    auth.updatedAt = new Date();

    return auth;
  }

  async softDelete(id: string): Promise<AuthEntity> {
    const auth = this.auths.find((auth) => auth.id === id);

    if (!auth) throw new Error('Auth not found');

    auth.updatedAt = new Date();
    auth.deletedAt = new Date();

    return auth;
  }

  async delete(id: string): Promise<AuthEntity> {
    const auth = this.auths.find((auth) => auth.id === id);

    if (!auth) throw new Error('Auth not found');

    this.auths = this.auths.filter((auth) => auth.id !== id);

    return auth;
  }
}
