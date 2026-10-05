import http from 'http';
import { env } from './config/env.js';
import { logger } from './shared/utils/logger.js';
import { verifyEnvironmentSetup } from './shared/utils/envCheck.js';
import { connectDB, disconnectDB } from './config/database.js';
import { connectRedis, disconnectRedis } from './config/redis.js';
import { initSocketIO } from './config/socket.js';
import { initCloudinary } from './config/cloudinary.js';
import { initFirebase } from './config/firebase.js';
import { createApp } from './app.js';

const startServer = async () => {
  try {
    verifyEnvironmentSetup();

    // Initialize databases & cloud integrations
    await connectDB();
    await connectRedis();
    initCloudinary();
    initFirebase();

    const app = createApp();
    const server = http.createServer(app);

    // Initialize Socket.IO with server
    initSocketIO(server);

    const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : env.PORT;
    const HOST = '0.0.0.0';

    server.listen(PORT, HOST, () => {
      logger.info(`🚀 Feasto Backend listening on http://${HOST}:${PORT}`);
      logger.info(`📚 Swagger OpenAPI Documentation available at http://${HOST}:${PORT}/api/v1/docs`);
    });

    const gracefulShutdown = async (signal: string) => {
      logger.info(`Received ${signal}. Initiating graceful shutdown...`);
      server.close(async () => {
        logger.info('HTTP server closed.');
        await disconnectDB();
        await disconnectRedis();
        logger.info('Feasto Backend V2 shutdown complete.');
        process.exit(0);
      });

      // Force shutdown if process hangs over 10s
      setTimeout(() => {
        logger.error('Forced shutdown due to timeout');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

    process.on('unhandledRejection', (reason: Error) => {
      logger.error({ err: reason }, 'Unhandled Rejection detected');
    });

    process.on('uncaughtException', (error: Error) => {
      logger.error({ err: error }, 'Uncaught Exception detected. Shutting down...');
      process.exit(1);
    });
  } catch (error) {
    logger.error({ error }, 'Fatal error during server startup');
    process.exit(1);
  }
};

startServer();
