import { useQueryClient } from '@tanstack/react-query';
import { useSocketRoom } from './useSocketRoom';
import { useSocketEvent } from './useSocketEvent';
import { socketRooms, SOCKET_EVENTS } from '@/services/socket';
import { queryKeys } from '@/lib/query/queryKeys';

export function useOrderRealtime(orderId?: string) {
  const queryClient = useQueryClient();
  const room = orderId ? socketRooms.order(orderId) : undefined;

  useSocketRoom(room);

  useSocketEvent(SOCKET_EVENTS.ORDER_UPDATED, (data) => {
    if (orderId && data?.orderId === orderId) {
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.detail(orderId) });
    } else {
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.list });
    }
  });
}
