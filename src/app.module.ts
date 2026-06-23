import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './infrastructure/database/prisma/prisma.module';
import { UserModule } from './modules/user/user.module';
import { CqrsModule } from '@nestjs/cqrs';
import { HealthModule } from './infrastructure/health/health.module';
import { RedisModule } from './infrastructure/redis/redis.module';
import { EventModule } from './shared/events/event.module';

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

//Arrumar tsconfig
//Arrumar Cache
