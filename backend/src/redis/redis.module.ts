import { Global, Inject, Logger, Module, type OnApplicationShutdown } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Redis } from 'ioredis';
import { CacheService } from './cache.service.js';
import { REDIS_CLIENT } from './redis.constant.js';

@Global()
@Module({
  providers: [
    {
      provide: REDIS_CLIENT,
      inject: [ConfigService],
      useFactory: (config: ConfigService): Redis => {
        const logger = new Logger('Redis');
        const client = new Redis({
          host: config.getOrThrow<string>('REDIS_HOST'),
          port: Number(config.getOrThrow<string>('REDIS_PORT')),
          password: config.get<string>('REDIS_PASSWORD') || undefined,
          maxRetriesPerRequest: 1,
          enableOfflineQueue: false,
        });
        client.on('ready', () => logger.log('Connected to Redis'));
        client.on('error', (error) => logger.error(error.message));
        return client;
      },
    },
    CacheService,
  ],
  exports: [CacheService],
})
export class RedisModule implements OnApplicationShutdown {
    constructor(@Inject(REDIS_CLIENT) private readonly redis: Redis) {}

    async onApplicationShutdown() {
        await this.redis.quit();
    }
}