export type SocketConnectionState = 'disconnected' | 'connecting' | 'connected' | 'error';

export interface SocketEventCallback<T = any> {
  (data: T): void;
}
