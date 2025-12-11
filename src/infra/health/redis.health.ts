import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { HealthIndicator, HealthIndicatorResult } from '@nestjs/terminus';

@Injectable()
export class RedisHealthIndicator extends HealthIndicator {
  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {
    super();
  }

  async isHealthy(key: 'redis'): Promise<HealthIndicatorResult> {
    try {
      await this.cacheManager.set('health_check', 'ok', 1);
      const value = await this.cacheManager.get('health_check');

      const isHealthy = value === 'ok';

      return this.getStatus(key, isHealthy);
    } catch (error) {
      return this.getStatus(key, false, { message: error.message });
    }
  }
}
