/// <reference types="jest" />
import dotenv from 'dotenv';

dotenv.config({ path: '.env' });

process.env.NODE_ENV = 'test';
process.env.PORT = '5001';
process.env.JWT_SECRET = 'test-secret-access-key-minimum-32-chars-long';
process.env.JWT_REFRESH_SECRET = 'test-secret-refresh-key-minimum-32-chars-long';
