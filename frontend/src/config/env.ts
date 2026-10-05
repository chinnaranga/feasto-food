import { z } from 'zod';

const envSchema = z.object({
  VITE_API_BASE_URL: z
    .string()
    .url()
    .default('http://localhost:5000/api/v1'),
  VITE_SOCKET_URL: z
    .string()
    .url()
    .default('http://localhost:5000'),
  VITE_APP_ENV: z
    .enum(['development', 'preview', 'production'])
    .default('development'),
  VITE_ENABLE_REALTIME: z
    .string()
    .transform((val) => val === 'true')
    .default('true'),
  VITE_ENABLE_FIREBASE_MESSAGING: z
    .string()
    .transform((val) => val === 'true')
    .default('false'),
});

function parseEnv() {
  const isProductionHost =
    typeof window !== 'undefined' &&
    window.location.hostname !== 'localhost' &&
    window.location.hostname !== '127.0.0.1';

  let rawApiBase = import.meta.env.VITE_API_BASE_URL;

  // In production builds or on production domains, NEVER connect to localhost
  if ((import.meta.env.PROD || isProductionHost) && (!rawApiBase || rawApiBase.includes('localhost') || rawApiBase.includes('127.0.0.1'))) {
    rawApiBase = 'https://feasto-backend-n4nn.onrender.com/api/v1';
  }

  const defaultApiBase = import.meta.env.PROD
    ? 'https://feasto-backend-n4nn.onrender.com/api/v1'
    : 'https://feasto-backend-n4nn.onrender.com/api/v1';

  const defaultSocketUrl = import.meta.env.PROD
    ? 'https://feasto-backend-n4nn.onrender.com'
    : 'https://feasto-backend-n4nn.onrender.com';

  const envObj = {
    VITE_API_BASE_URL: rawApiBase || defaultApiBase,
    VITE_SOCKET_URL: import.meta.env.VITE_SOCKET_URL || defaultSocketUrl,
    VITE_APP_ENV: import.meta.env.VITE_APP_ENV || (import.meta.env.PROD ? 'production' : 'development'),
    VITE_ENABLE_REALTIME: import.meta.env.VITE_ENABLE_REALTIME || 'true',
    VITE_ENABLE_FIREBASE_MESSAGING: import.meta.env.VITE_ENABLE_FIREBASE_MESSAGING || 'false',
  };

  const parsed = envSchema.safeParse(envObj);
  if (!parsed.success) {
    console.error('❌ Invalid environment configuration:', parsed.error.format());
    throw new Error('Environment configuration validation failed');
  }

  return parsed.data;
}

export const env = parseEnv();
