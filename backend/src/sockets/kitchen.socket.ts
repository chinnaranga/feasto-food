import { Server } from 'socket.io';
import { logger } from '../shared/utils/logger.js';

export function registerKitchenSocketHandlers(io: Server): void {
  const nsp = io.of('/restaurants');

  nsp.on('connection', (socket) => {
    socket.on('join:kitchen', (data: { restaurantId: string; branchId?: string; stationId?: string }) => {
      if (data?.restaurantId) {
        socket.join(`kitchen:${data.branchId || data.restaurantId}`);
        if (data.stationId) {
          socket.join(`station:${data.stationId}`);
        }
        logger.info(`⚡ Socket ${socket.id} joined kitchen:${data.branchId || data.restaurantId}`);
      }
    });

    socket.on('leave:kitchen', (data: { restaurantId: string; branchId?: string }) => {
      if (data?.restaurantId) {
        socket.leave(`kitchen:${data.branchId || data.restaurantId}`);
      }
    });
  });
}
