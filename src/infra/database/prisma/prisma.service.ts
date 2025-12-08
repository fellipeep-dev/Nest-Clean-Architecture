import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { QueryEvent } from './generated/internal/prismaNamespace';
import { PrismaClient } from './generated/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor(private readonly config: ConfigService) {
    const adapter = new PrismaPg({
      connectionString: config.get<string>('DATABASE_URL'),
    });
    super({
      adapter,
      log: [
        { level: 'query', emit: 'event' },
        { level: 'error', emit: 'stdout' },
        { level: 'warn', emit: 'stdout' },
      ],
    });
  }

  async onModuleInit() {
    await this.$connect();

    this.$on('query' as never, (event: QueryEvent) => {
      console.log('Query:', event.query);
      console.log('Parameters:', event.params);
      console.log('Duration:', event.duration + 'ms');
    });
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
