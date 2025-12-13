import { Inject } from '@nestjs/common';
import { PrismaService } from 'src/infra/database/prisma/prisma.service';
import { AuditableEntity, BaseEntity } from '../entities';
import { QueryBuilderEntity } from '@entities';

export abstract class RepositoryFactory<
  E extends object = BaseEntity | AuditableEntity,
  C extends object = any,
  U extends object = any,
> {
  @Inject(PrismaService)
  public readonly prismaService: PrismaService;

  constructor(public model: string) {}

  create(createDto: C): Promise<E> {
    return (this.prismaService as any)[this.model].create({
      data: {
        ...createDto,
        deletedAt: null,
      },
    });
  }

  createMany(createDtos: C[]): Promise<E[]> {
    const dtos = createDtos.map((createDto) => ({
      ...createDto,
      deletedAt: null,
    }));

    return (this.prismaService as any)[this.model].createMany({
      data: dtos,
    });
  }

  findAll(query: QueryBuilderEntity): Promise<E[]> {
    return (this.prismaService as any)[this.model].findMany(query);
  }

  findManyWithIds(ids: string[]): Promise<E[]> {
    return (this.prismaService as any)[this.model].findMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
  }

  findById(id: string): Promise<E | null> {
    return (this.prismaService as any)[this.model].findUnique({
      where: {
        id,
        deletedAt: null,
      },
    });
  }

  update(updateDto: U): Promise<E> {
    const { id, ...updateInput } = updateDto as any;

    return (this.prismaService as any)[this.model].update({
      where: {
        id,
      },
      data: {
        ...updateInput,
        updatedAt: new Date(),
      },
    });
  }

  softDelete(id: string): Promise<E> {
    return (this.prismaService as any)[this.model].update({
      where: {
        id,
      },
      data: {
        deletedAt: new Date(),
        updatedAt: new Date(),
      },
    });
  }

  delete(id: string): Promise<E> {
    return (this.prismaService as any)[this.model].delete({
      where: {
        id,
      },
    });
  }
}
