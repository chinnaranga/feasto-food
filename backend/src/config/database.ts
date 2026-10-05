import mongoose from 'mongoose';
import { env } from './env.js';
import { logger } from '../shared/utils/logger.js';

let isConnected = false;

export interface DBStatus {
  status: 'connected' | 'disconnected' | 'connecting' | 'disconnecting';
  readyState: number;
  databaseName?: string;
  host?: string;
}

export const connectDB = async (): Promise<typeof mongoose | void> => {
  if (isConnected || mongoose.connection.readyState === 1) {
    logger.info('MongoDB connection already established');
    return;
  }

  try {
    mongoose.set('strictQuery', true);

    mongoose.connection.on('connected', () => {
      isConnected = true;
      logger.info('🍃 MongoDB connected successfully');
    });

    mongoose.connection.on('error', (err) => {
      logger.error({ err }, '❌ MongoDB connection error encountered');
    });

    mongoose.connection.on('disconnected', () => {
      isConnected = false;
      logger.warn('⚠️ MongoDB connection disconnected');
    });

    const conn = await mongoose.connect(env.MONGODB_URI, {
      autoIndex: env.NODE_ENV !== 'production',
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    isConnected = true;
    return conn;
  } catch (error) {
    logger.error({ error }, '❌ MongoDB initial connection failed');
    if (env.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
};

export const disconnectDB = async (): Promise<void> => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
    isConnected = false;
    logger.info('MongoDB connection closed gracefully');
  }
};

export const getDBStatus = (): DBStatus => {
  const readyStateMap: Record<number, DBStatus['status']> = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };

  const state = mongoose.connection.readyState;
  const status = readyStateMap[state] || 'disconnected';

  return {
    status,
    readyState: state,
    databaseName: mongoose.connection.name,
    host: mongoose.connection.host,
  };
};
