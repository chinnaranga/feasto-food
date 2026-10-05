import { Server } from 'socket.io';
import { logger } from '../shared/utils/logger.js';

export function registerRestaurantSocketHandlers(io: Server): void {
  const nsp = io.of('/restaurants');

  nsp.on('connection', (socket) => {
    logger.info({ socketId: socket.id }, '⚡ Restaurant Socket connected');

    socket.on('join:restaurant', (data: { restaurantId: string; branchId?: string }) => {
      if (data?.restaurantId) {
        socket.join(`restaurant:${data.restaurantId}`);
        if (data.branchId) {
          socket.join(`branch:${data.branchId}`);
        }
        logger.info(`⚡ Socket ${socket.id} joined restaurant:${data.restaurantId}`);
      }
    });

    socket.on('leave:restaurant', (data: { restaurantId: string; branchId?: string }) => {
      if (data?.restaurantId) {
        socket.leave(`restaurant:${data.restaurantId}`);
        if (data.branchId) {
          socket.leave(`branch:${data.branchId}`);
        }
      }
    });
  });
}
