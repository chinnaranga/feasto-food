import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
  PORT: z.string().default('5000').transform((val: string) => parseInt(val, 10)),
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  
  MONGODB_URI: z.string().default('mongodb://127.0.0.1:27017/feasto_v2'),
  REDIS_URL: z.string().default('redis://127.0.0.1:6379'),
  
  JWT_SECRET: z.string().default('default-feasto-v2-access-jwt-secret-min32chars!'),
  JWT_REFRESH_SECRET: z.string().default('default-feasto-v2-refresh-jwt-secret-min32chars!'),
  JWT_EXPIRES_IN: z.string().default('15m'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),
  
  CLIENT_URL: z.string().default('http://localhost:3000'),
  ADMIN_URL: z.string().default('http://localhost:3001'),
  RIDER_URL: z.string().default('http://localhost:3002'),
  RESTAURANT_URL: z.string().default('http://localhost:3003'),
  
  CLOUDINARY_CLOUD_NAME: z.string().default('feasto_dev'),
  CLOUDINARY_API_KEY: z.string().default('dev_key'),
  CLOUDINARY_API_SECRET: z.string().default('dev_secret'),
  
  FIREBASE_SERVICE_ACCOUNT_JSON: z.string().optional(),
  FCM_ENABLED: z.string().default('false').transform((val: string) => val === 'true'),
  
  GOOGLE_MAPS_API_KEY: z.string().optional(),
  
  CORS_ORIGINS: z.string().default('http://localhost:3000,http://localhost:3001,http://localhost:3002,http://localhost:3003'),
  RATE_LIMIT_WINDOW: z.string().default('15').transform((val: string) => parseInt(val, 10)),
  RATE_LIMIT_MAX: z.string().default('100').transform((val: string) => parseInt(val, 10)),
  
  RAZORPAY_KEY_ID: z.string().optional(),
  RAZORPAY_KEY_SECRET: z.string().optional(),

  // NVIDIA Nemotron AI Service
  AI_PROVIDER: z.string().default('nemotron'),
  AI_MODEL: z.string().default('nvidia/nemotron-3-ultra-550b-a55b'),
  NEMOTRON_API_KEY: z.string().optional().default(''),
  NEMOTRON_BASE_URL: z.string().default('https://integrate.api.nvidia.com/v1'),
  NEMOTRON_TIMEOUT_MS: z.string().default('15000').transform((val: string) => parseInt(val, 10)),
  NEMOTRON_MAX_RETRIES: z.string().default('2').transform((val: string) => parseInt(val, 10)),
});

export type Env = z.infer<typeof envSchema>;

let parsedEnv: Env;

try {
  parsedEnv = envSchema.parse(process.env);
} catch (error: unknown) {
  if (error instanceof z.ZodError) {
    const formatted = error.errors.map((e: z.ZodIssue) => `${e.path.join('.')}: ${e.message}`).join(', ');
    console.error(`❌ Invalid Environment Variables Configuration: ${formatted}`);
  } else {
    console.error('❌ Failed to parse environment variables:', error);
  }
  process.exit(1);
}

export const env = parsedEnv;
