import { useEffect } from 'react';
import { socketClient } from '@/services/socket';

export function useSocketRoom(roomName?: string) {
  useEffect(() => {
    if (!roomName) return;

    socketClient.joinRoom(roomName);

    return () => {
      socketClient.leaveRoom(roomName);
    };
  }, [roomName]);
}
