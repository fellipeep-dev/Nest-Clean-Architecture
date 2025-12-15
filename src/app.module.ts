import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './infra/database/prisma/prisma.module';
import { UserModule } from './modules/user/user.module';
import { CqrsModule } from '@nestjs/cqrs';
import { HealthModule } from './infra/health/health.module';
import { RedisModule } from './infra/redis/redis.module';
import { EventModule } from './common/events/event.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CqrsModule.forRoot(),
    PrismaModule,
    RedisModule,
    HealthModule,
    EventModule,
    UserModule,
  ],
})
export class AppModule {}
