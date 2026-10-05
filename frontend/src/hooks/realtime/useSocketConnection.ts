import { useEffect, useState } from 'react';
import { socketClient, SocketConnectionState } from '@/services/socket';
import { useAuthStore } from '@/store/authStore';

export function useSocketConnection(): SocketConnectionState {
  const [state, setState] = useState<SocketConnectionState>(socketClient.getState());
  const token = useAuthStore((s) => s.token);

  useEffect(() => {
    socketClient.connect(token || undefined);

    const unsubscribe = socketClient.subscribe('connection_status', (newState) => {
      setState(newState);
    });

    return () => {
      unsubscribe();
    };
  }, [token]);

  return state;
}
