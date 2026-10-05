import { useEffect } from 'react';
import { socketClient } from '@/services/socket';

export function useSocketEvent<T = any>(event: string, callback: (data: T) => void) {
  useEffect(() => {
    const unsubscribe = socketClient.subscribe(event, callback);
    return () => {
      unsubscribe();
    };
  }, [event, callback]);
}
