import { Redis } from 'ioredis';
import { env } from './env.js';
import { logger } from '../shared/utils/logger.js';

let redisClient: Redis | null = null;

export interface RedisStatus {
  status: 'connected' | 'disconnected' | 'connecting' | 'error';
  ping?: string;
}

export const getRedisClient = (): Redis => {
  if (!redisClient) {
    redisClient = new Redis(env.REDIS_URL, {
      maxRetriesPerRequest: 3,
      enableReadyCheck: true,
      lazyConnect: true,
      retryStrategy(times: number) {
        if (times > 3) {
          logger.warn('Redis unavailable after 3 attempts. Stopping reconnects; running without Redis cache.');
          return null;
        }
        return Math.min(times * 200, 2000);
      },
    });

    redisClient.on('connect', () => {
      logger.info('🔴 Redis client connecting...');
    });

    redisClient.on('ready', () => {
      logger.info('🔴 Redis client ready and connected');
    });

    redisClient.on('error', (err: Error) => {
      logger.warn({ err: err.message }, 'Redis connection unavailable (continuing without cache)');
    });

    redisClient.on('end', () => {
      logger.warn('Redis client connection ended');
    });
  }

  return redisClient;
};

export const connectRedis = async (): Promise<void> => {
  try {
    const client = getRedisClient();
    if (client.status === 'ready' || client.status === 'connecting') {
      return;
    }
    await client.connect();
  } catch (error) {
    logger.warn('Redis connection failed; application running with in-memory fallback');
  }
};

export const disconnectRedis = async (): Promise<void> => {
  if (redisClient) {
    await redisClient.quit();
    redisClient = null;
    logger.info('Redis client disconnected gracefully');
  }
};

export const getRedisStatus = async (): Promise<RedisStatus> => {
  if (!redisClient) {
    return { status: 'disconnected' };
  }

  try {
    if (redisClient.status === 'ready') {
      const pingResult = await redisClient.ping();
      return { status: 'connected', ping: pingResult };
    }
    return { status: redisClient.status as RedisStatus['status'] };
  } catch (err) {
    return { status: 'error' };
  }
};
