import { Server as HttpServer } from 'http';
import { Server, ServerOptions } from 'socket.io';
import { env } from './env.js';
import { logger } from '../shared/utils/logger.js';

let io: Server | null = null;

export const initSocketIO = (httpServer: HttpServer): Server => {
  const allowedOrigins = env.CORS_ORIGINS.split(',').map((o: string) => o.trim());

  const options: Partial<ServerOptions> = {
    cors: {
      origin: allowedOrigins,
      credentials: true,
      methods: ['GET', 'POST'],
    },
    transports: ['websocket', 'polling'],
  };

  io = new Server(httpServer, options);

  // Setup Namespaces Scaffolding
  const ordersNamespace = io.of('/orders');
  const ridersNamespace = io.of('/riders');
  const restaurantsNamespace = io.of('/restaurants');
  const notificationsNamespace = io.of('/notifications');
  const adminNamespace = io.of('/admin');

  ordersNamespace.on('connection', (socket) => {
    logger.info({ socketId: socket.id }, '⚡ Socket connected to /orders namespace');
  });

  ridersNamespace.on('connection', (socket) => {
    logger.info({ socketId: socket.id }, '⚡ Socket connected to /riders namespace');
  });

  restaurantsNamespace.on('connection', (socket) => {
    logger.info({ socketId: socket.id }, '⚡ Socket connected to /restaurants namespace');
  });

  notificationsNamespace.on('connection', (socket) => {
    logger.info({ socketId: socket.id }, '⚡ Socket connected to /notifications namespace');
  });

  adminNamespace.on('connection', (socket) => {
    logger.info({ socketId: socket.id }, '⚡ Socket connected to /admin namespace');
  });

  import('../sockets/tracking.socket.js').then(({ registerTrackingSocketHandlers }) => {
    if (io) registerTrackingSocketHandlers(io);
  });

  import('../sockets/restaurant.socket.js').then(({ registerRestaurantSocketHandlers }) => {
    if (io) registerRestaurantSocketHandlers(io);
  });

  import('../sockets/kitchen.socket.js').then(({ registerKitchenSocketHandlers }) => {
    if (io) registerKitchenSocketHandlers(io);
  });

  logger.info('⚡ Socket.IO initialized with namespaces: /orders, /riders, /restaurants, /notifications, /admin');

  return io;
};

export const getSocketIO = (): Server => {
  if (!io) {
    throw new Error('Socket.IO is not initialized yet. Call initSocketIO first.');
  }
  return io;
};

export const emitToRoom = (namespace: string, room: string, event: string, data: unknown): void => {
  if (!io) return;
  io.of(namespace).to(room).emit(event, data);
};

export const socketGateway = {
  getSocketIO,
  emitToRoom,
};
