import { Inject, Injectable, Logger } from "@nestjs/common";
import { Redis } from "ioredis";
import { REDIS_CLIENT } from "./redis.constant.js";

@Injectable()
export class CacheService{

    private readonly logger = new Logger(CacheService.name);

    constructor(@Inject(REDIS_CLIENT) private readonly redis: Redis) {}

    async get<T>(key: string): Promise<T | null> {
    try {
      const raw = await this.redis.get(key);
      return raw === null ? null : (JSON.parse(raw) as T);
    } catch (error) {
      this.logger.warn(`GET ${key} failed: ${(error as Error).message}`);
      return null;
    }
  }

    async set(key: string, value: unknown, ttlSeconds: number): Promise<void> {
    try {
      await this.redis.set(key, JSON.stringify(value), 'EX', ttlSeconds);
    } catch (error) {
      this.logger.warn(`SET ${key} failed: ${(error as Error).message}`);
    }
  }

   async del(...keys: string[]): Promise<void> {
    if (keys.length === 0) return;
    try {
      await this.redis.del(...keys);
    } catch (error) {
      this.logger.warn(`DEL ${keys.join(', ')} failed: ${(error as Error).message}`);
    }
  }



}