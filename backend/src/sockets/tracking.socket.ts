import { Server } from 'socket.io';
import { trackingService } from '../modules/tracking/tracking.service.js';
import { logger } from '../shared/utils/logger.js';

export const registerTrackingSocketHandlers = (io: Server): void => {
  const ordersNamespace = io.of('/orders');
  const ridersNamespace = io.of('/riders');

  // Customer / Restaurant joining order tracking room
  ordersNamespace.on('connection', (socket) => {
    socket.on('order:join', (data: { orderId: string }) => {
      if (data && data.orderId) {
        socket.join(`order:${data.orderId}`);
        logger.info({ socketId: socket.id, orderId: data.orderId }, '⚡ Joined order tracking room');
      }
    });

    socket.on('order:leave', (data: { orderId: string }) => {
      if (data && data.orderId) {
        socket.leave(`order:${data.orderId}`);
        logger.info({ socketId: socket.id, orderId: data.orderId }, '⚡ Left order tracking room');
      }
    });
  });

  // Rider pushing high-frequency GPS location pings over Socket.IO
  ridersNamespace.on('connection', (socket) => {
    socket.on(
      'rider:location_ping',
      async (data: {
        sessionId: string;
        latitude: number;
        longitude: number;
        heading?: number;
        speed?: number;
        accuracy?: number;
      }) => {
        try {
          if (data && data.sessionId) {
            await trackingService.pushRiderLocation(data.sessionId, {
              latitude: data.latitude,
              longitude: data.longitude,
              heading: data.heading,
              speed: data.speed,
              accuracy: data.accuracy,
            });
          }
        } catch (err) {
          logger.error({ err, socketId: socket.id }, '❌ Socket location_ping processing failed');
        }
      }
    );
  });
};
