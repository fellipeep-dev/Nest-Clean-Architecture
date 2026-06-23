import { Controller, Get } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckService,
  HttpHealthIndicator,
  PrismaHealthIndicator,
} from '@nestjs/terminus';
import { RedisHealthIndicator } from './redis.health';
import { PrismaService } from '../database/prisma/prisma.service';

@Controller('health')
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly http: HttpHealthIndicator,
    private readonly prisma: PrismaHealthIndicator,
    private readonly prismaService: PrismaService,
    private readonly redisHealth: RedisHealthIndicator,
  ) {}

  @Get('liveness')
  @HealthCheck()
  liveness() {
    return this.health.check([
      () => this.http.pingCheck('self', 'http://localhost:3000/health/ping'),
    ]);
  }

  @Get('ping')
  ping() {
    return { status: 'ok' };
  }

  @Get('readiness')
  @HealthCheck()
  readiness() {
    return this.health.check([
      () => this.prisma.pingCheck('database', this.prismaService),
      () => this.http.pingCheck('api', 'http://localhost:3000/health/ping'),
      () => this.redisHealth.isHealthy('redis'),
    ]);
  }
}
