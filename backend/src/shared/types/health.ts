import { DBStatus } from '../../config/database.js';
import { RedisStatus } from '../../config/redis.js';

export interface HealthCheckReport {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  uptimeSeconds: number;
  environment: string;
  services: {
    api: { status: 'up' };
    database: DBStatus;
    redis: RedisStatus;
    fcm: { status: 'enabled' | 'disabled' };
  };
  system: {
    memoryUsageMB: {
      rss: number;
      heapTotal: number;
      heapUsed: number;
    };
    nodeVersion: string;
  };
}
