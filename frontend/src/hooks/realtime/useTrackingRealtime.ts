import { useQueryClient } from '@tanstack/react-query';
import { useSocketRoom } from './useSocketRoom';
import { useSocketEvent } from './useSocketEvent';
import { socketRooms, SOCKET_EVENTS } from '@/services/socket';
import { queryKeys } from '@/lib/query/queryKeys';

export function useTrackingRealtime(orderId?: string) {
  const queryClient = useQueryClient();
  const room = orderId ? socketRooms.order(orderId) : undefined;

  useSocketRoom(room);

  useSocketEvent(SOCKET_EVENTS.LOCATION_UPDATE, (data) => {
    if (orderId && data?.orderId === orderId) {
      queryClient.setQueryData(queryKeys.orders.tracking(orderId), (oldData: any) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          currentLocation: data.location,
        };
      });
    }
  });
}
