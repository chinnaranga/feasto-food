import { useQueryClient } from '@tanstack/react-query';
import { useSocketRoom } from './useSocketRoom';
import { useSocketEvent } from './useSocketEvent';
import { socketRooms, SOCKET_EVENTS } from '@/services/socket';
import { queryKeys } from '@/lib/query/queryKeys';
import { useAuthStore } from '@/store/authStore';

export function useNotificationRealtime() {
  const queryClient = useQueryClient();
  const userId = useAuthStore((s) => s.user?.id);
  const room = userId ? socketRooms.user(userId) : undefined;

  useSocketRoom(room);

  useSocketEvent(SOCKET_EVENTS.NOTIFICATION_NEW, () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.notifications.list });
    queryClient.invalidateQueries({ queryKey: queryKeys.notifications.unread });
  });
}
